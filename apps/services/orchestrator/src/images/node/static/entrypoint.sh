#!/bin/sh

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

# Define sensitive environment variables to block from build process
# Add any sensitive ENVs that should NOT be available to build
BUILD_BLOCKED_ENVS="AWS_ACCESS_KEY_ID AWS_SECRET_ACCESS_KEY AWS_SESSION_TOKEN BUCKET_NAME ENDPOINT_URL DATABASE_URL DB_PASSWORD API_SECRET PRIVATE_KEY TOKEN SECRET BUILD_SECRET"

# Function to prepare isolated build environment
prepare_build_env(){
    local repo_dir=$1
    local artifacts_dir=$2
    
    # Create necessary directories
    mkdir -p "$artifacts_dir"
    mkdir -p /tmp/build_root/{bin,lib,lib64,usr/bin,usr/lib,etc,tmp,proc,dev}
    
    # Mount essential binaries and libraries for build process
    # Node.js/npm related
    [ -f /usr/bin/node ] && cp /usr/bin/node /tmp/build_root/usr/bin/
    [ -f /usr/bin/npm ] && cp /usr/bin/npm /tmp/build_root/usr/bin/
    [ -f /usr/bin/npx ] && cp /usr/bin/npx /tmp/build_root/usr/bin/
    [ -f /usr/bin/yarn ] && cp /usr/bin/yarn /tmp/build_root/usr/bin/
    
    # Python related (if needed)
    [ -f /usr/bin/python3 ] && cp /usr/bin/python3 /tmp/build_root/usr/bin/
    [ -f /usr/bin/pip3 ] && cp /usr/bin/pip3 /tmp/build_root/usr/bin/
    
    # Essential system binaries
    for binary in sh bash cp mv mkdir rm ls cat grep sed awk tar gzip; do
        if [ -f "/bin/$binary" ]; then
            cp "/bin/$binary" "/tmp/build_root/bin/"
        elif [ -f "/usr/bin/$binary" ]; then
            cp "/usr/bin/$binary" "/tmp/build_root/usr/bin/"
        fi
    done
    
    # Copy essential libraries
    if [ -d /lib ]; then
        cp -r /lib/* /tmp/build_root/lib/ 2>/dev/null || true
    fi
    if [ -d /lib64 ]; then
        cp -r /lib64/* /tmp/build_root/lib64/ 2>/dev/null || true
    fi
    if [ -d /usr/lib ]; then
        cp -r /usr/lib/* /tmp/build_root/usr/lib/ 2>/dev/null || true
    fi
    
    # Copy essential configuration files
    [ -f /etc/passwd ] && cp /etc/passwd /tmp/build_root/etc/
    [ -f /etc/group ] && cp /etc/group /tmp/build_root/etc/
    [ -f /etc/ld.so.conf ] && cp /etc/ld.so.conf /tmp/build_root/etc/
    [ -d /etc/ssl ] && cp -r /etc/ssl /tmp/build_root/etc/ 2>/dev/null || true
    
    log "BUILD" "Build environment prepared with necessary binaries and libraries"
}

# Function to run build in unshare isolated environment
run_isolated_build(){
    local repo_dir=$1
    local artifacts_dir=$2
    local build_command=$3
    
    # Prepare the build environment
    prepare_build_env "$repo_dir" "$artifacts_dir"
    
    # Build the environment variables string for the isolated process (exclude sensitive ones)
    local build_env=""
    for env_var in $(env | cut -d= -f1); do
        # Check if this env var is in the blocked list
        local is_blocked=""
        for blocked_var in $BUILD_BLOCKED_ENVS; do
            if [ "$env_var" = "$blocked_var" ]; then
                is_blocked="yes"
                break
            fi
        done
        
        # If not blocked, include it in build environment
        if [ -z "$is_blocked" ]; then
            local env_value=$(eval echo \$env_var)
            if [ -n "$env_value" ]; then
                build_env="$build_env export $env_var='$env_value';"
            fi
        fi
    done
    
    log "BUILD" "Starting isolated build with unshare (PID, Mount namespaces)"
    
    # Create the isolation script

    
    # Create a temporary file to capture the exit status of the isolated process
    local status_file="/tmp/build_status_$"
    
    # Run in isolated namespaces with bind mounts (keeping network access)
    if ! unshare --pid --mount --fork sh -c "
        # Mount proc for the new PID namespace
        mount -t proc proc /tmp/build_root/proc
        
        # Bind mount the repository (read-only)
        mkdir -p /tmp/build_root$repo_dir
        mount --bind $repo_dir /tmp/build_root$repo_dir
        mount -o remount,ro,bind /tmp/build_root$repo_dir
        
        # Bind mount artifacts directory (read-write)
        mkdir -p /tmp/build_root$artifacts_dir
        mount --bind $artifacts_dir /tmp/build_root$artifacts_dir
        
        # Bind mount build script
        mount --bind /build.sh /tmp/build_root/tmp/build_script.sh
        
        # Change root and execute build

        chroot /tmp/build_root /tmp/build_script.sh
    " 2> >(while IFS= read -r line; do log "BUILD" "❌ $line"; done) \
       | while IFS= read -r line; do log "BUILD" "$line"; done; then
        error_exit "BUILD" "Build failed"
    fi
    
    
    # Check if build was successful
    if [ ! "$(ls -A $artifacts_dir 2>/dev/null)" ]; then
        error_exit "BUILD" "Build failed - no artifacts generated in $artifacts_dir"
    fi
    
    # Cleanup
    rm -rf /tmp/build_root /tmp/build_script.sh 2>/dev/null || true
    
    log "BUILD" "Build completed successfully in isolated environment"
}

get_creds() {
    curl "$ORCHESTRATOR" \
        -H "Authorization: Bearer $BUILD_TOKEN" \
        -s -o /tmp/creds.json || error_exit "SYSTEM" "Failed to fetch credentials from orchestrator"

  
    jq -c '.res[]' /tmp/creds.json | while read -r env; do
        name=$(echo "$env" | jq -r '.envName')
        value=$(echo "$env" | jq -r '.envValue')

    
        # upper_snake=$(printf '%s' "$name" \
        #     | sed -r 's/([a-z0-9])([A-Z])/\1_\2/g' \
        #     | tr '[:lower:]' '[:upper:]')

        export "$name"="$value"
    done
}


# Main execution starts here
log "SYSTEM" "📁 Cloning repository: $REPO_URI"

get_creds

# Set up directories
REPO_DIR="/app/repo"
ARTIFACTS_DIR="/app/artifacts"

# Clean any existing directories
rm -rf "$REPO_DIR" "$ARTIFACTS_DIR" 2>/dev/null || true

# Clone repository
if ! git clone --branch "$REPO_BRANCH" --single-branch "$REPO_URI" "$REPO_DIR" 2>/var/log/git.log; then
   error_exit "BUILD" "Failed to clone repository"
fi

# Run isolated build
run_isolated_build "$REPO_DIR" "$ARTIFACTS_DIR" "$BUILD_COMMAND"

log "SYSTEM" "📤 Deploying artifacts to $DOMAIN"

# Deploy artifacts
if ! aws s3 cp "$ARTIFACTS_DIR" "$S3_URI" --recursive --endpoint-url "$END_POINT_URI" 2>/var/log/aws.log; then
    error_exit "RUNTIME" "Failed to deploy artifacts to $DOMAIN"
fi

log "SYSTEM" "✅ Deployment completed successfully"

# Final cleanup
rm -rf "$REPO_DIR" "$ARTIFACTS_DIR" 2>/dev/null || true