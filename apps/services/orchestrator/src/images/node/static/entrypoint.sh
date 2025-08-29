#!/bin/bash

set -e

log(){
    local phase=$1
    local message=$2
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S:%MS')
    
    case $phase in
       SYSTEM)
        echo "[$timestamp] SYSTEM: $message"
        ;;
       BUILD)
        echo "[$timestamp] BUILD: $message"
        ;;
       RUNTIME)
        echo "[$timestamp] RUNTIME: $message"
        ;;
    esac
}

error_exit(){
    local phase=$1
    local message=$2
    log $phase "ERROR: ❌ $message"
    exit 1
}

validate_creds(){
    local status_code=$1
    local error_msg="Failed to get creds from orchestrator"
    
    # Check HTTP status first
    if [[ "$status_code" -ge 400 ]]; then
        if [[ -f /tmp/creds.json ]] && [[ -s /tmp/creds.json ]] && jq empty /tmp/creds.json 2>/dev/null; then
            local api_error=$(jq -r '.message // .error // empty' /tmp/creds.json 2>/dev/null)
            if [[ -n "$api_error" ]]; then
                error_msg="$api_error"
            fi
        fi
        error_exit "SYSTEM" "$error_msg"
    fi
    
    # For successful HTTP status, check if response indicates error
    if [[ -f /tmp/creds.json ]] && [[ -s /tmp/creds.json ]] && jq empty /tmp/creds.json 2>/dev/null; then
        # Check if res is null (indicates error even with 200)
        if jq -e '.res == null' /tmp/creds.json >/dev/null 2>&1; then
            local body_error=$(jq -r '.message // .error // "Failed to get creds from orchestrator"' /tmp/creds.json)
            error_exit "SYSTEM" "$body_error"
        fi
    else
        error_exit "SYSTEM" "$error_msg"
    fi
}

# Define sensitive environment variables to unset from build process
BUILD_BLOCKED_ENVS="AWS_ACCESS_KEY_ID AWS_SECRET_ACCESS_KEY BUCKET_NAME ENDPOINT_URI S3_URI DOMAIN CONTAINER_SECRET REPO_BRANCH REPO_URI ORCHESTRATOR_ENDPOINT GITHUB_REPO_FULLNAME AWS_RESPONSE_CHECKSUM_VALIDATION AWS_REQUEST_CHECKSUM_CALCULATION"

# Function to run build with filtered environment using env command
run_filtered_build(){
    local repo_dir=$1
    local artifacts_dir=$2
    local build_command=$3
    local out_dir=$4

    # Create necessary directories
    mkdir -p "$artifacts_dir"
    
    # Execute build command with filtered environment
    cd "$repo_dir"
    
    # Build the complete env command with proper argument handling
    local env_cmd="env"
    
    # Add unset flags for blacklisted variables
    for blocked_var in $BUILD_BLOCKED_ENVS; do
        env_cmd="$env_cmd -u $blocked_var"
    done
    
    # Add build-specific variables
    env_cmd="$env_cmd REPO_DIR=$repo_dir ARTIFACTS_DIR=$artifacts_dir"
    
    # Execute and capture exit code properly
    log "BUILD" "Starting build with command: $build_command"
    local build_exit_code=0
    eval "$env_cmd sh -c '$build_command'" \
        2> >(while IFS= read -r line; do log "BUILD" "ERROR: $line"; done) \
        | while IFS= read -r line; do log "BUILD" "$line"; done
    build_exit_code=${PIPESTATUS[0]}
    
    # Check if build failed and exit with same code
    if [ $build_exit_code -ne 0 ]; then
        error_exit "BUILD" "Build failed with exit code $build_exit_code"
    fi

    if [ ! -d "$out_dir" ]; then
        error_exit "BUILD" "Artifacts directory $out_dir does not exist"
    fi

    cp -r "$out_dir/." "$artifacts_dir/" || error_exit "BUILD" "Failed to copy artifacts from $out_dir to $artifacts_dir"

    # Check if build was successful
    if [ ! "$(ls -A $artifacts_dir 2>/dev/null)" ]; then
        error_exit "BUILD" "Build failed - no artifacts generated in $artifacts_dir"
    fi
    
    log "BUILD" "Build completed successfully with filtered environment"
}

get_creds() {
    # Capture HTTP status code
    local http_code=$(curl "$ORCHESTRATOR_ENDPOINT/containers/build/creds" \
        -H "Authorization: Bearer $CONTAINER_SECRET" \
        -s -w "%{http_code}" -o /tmp/creds.json)
    
    # Check curl command itself (network errors)
    if [[ $? -ne 0 ]]; then
        error_exit "SYSTEM" "Failed to connect to orchestrator"
    fi
    
    # Validate response
    validate_creds "$http_code"

    # If we reach here, credentials are valid
    while read -r env; do
        name=$(echo "$env" | jq -r '.envName')
        value=$(echo "$env" | jq -r '.envValue')
        export "$name=$value"
    done < <(jq -c '.res[]' /tmp/creds.json)

    log "SYSTEM" "Credentials loaded successfully"
}

# Main execution starts here
get_creds
log "SYSTEM" "📁 Cloning repository https://github.com/$GITHUB_REPO_FULLNAME with branch $REPO_BRANCH"

# Set up directories
REPO_DIR="/app/repo"
ARTIFACTS_DIR="/app/artifacts"
export AWS_REQUEST_CHECKSUM_CALCULATION=when_required
export AWS_RESPONSE_CHECKSUM_VALIDATION=when_required

# Clean any existing directories
rm -rf "$REPO_DIR" "$ARTIFACTS_DIR" 2>/dev/null || true

# Clone repository
if ! git clone --branch "$REPO_BRANCH" --single-branch "$REPO_URI" "$REPO_DIR" 2>/var/log/git.log; then
   error_exit "BUILD" "Failed to clone repository: either the branch or repo does not exists or user hasn't granted access to it"
fi

# Run filtered build
run_filtered_build "$REPO_DIR" "$ARTIFACTS_DIR" "$BUILD_COMMAND" "$OUT_DIR"

log "SYSTEM" "📤 Deploying artifacts to $DOMAIN"

cd "$ARTIFACTS_DIR"
if ! aws s3 sync . "$S3_URI"  --endpoint-url "$ENDPOINT_URI"  2>/var/log/aws.log; then
    log "RUNTIME" "AWS S3 upload error details:"
    cat /var/log/aws.log | while IFS= read -r line; do log "RUNTIME" "❌ $line"; done
    error_exit "RUNTIME" "Failed to deploy artifacts to $DOMAIN"
fi

log "SYSTEM" "✅ Deployment completed successfully"

# Final cleanup
rm -rf "$REPO_DIR" "$ARTIFACTS_DIR" 2>/dev/null || true