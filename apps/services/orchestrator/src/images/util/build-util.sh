#!/bin/bash


run_filtered_build(){
    local repo_dir=$1
    local build_command=$2
    local out_dir=$3
    local app_type=$4
    local artifacts_dir=$5

    # Create necessary directories
    if [ "$app_type" = "STATIC" ]; then
        mkdir -p "$artifacts_dir"
    fi

    # Execute build command with filtered environment
    cd "$repo_dir"

    
    # Build the complete env command with proper argument handling
    local env_cmd="env"
    
    # Add unset flags for blacklisted variables
    for blocked_var in $BUILD_BLOCKED_ENVS; do
        env_cmd="$env_cmd -u $blocked_var"
    done
    
    
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

    if [ "$app_type" = "STATIC" ] && [ ! -d "$out_dir" ]; then
        error_exit "BUILD" "Output directory $out_dir does not exist"
    fi

    if  [ "$app_type" = "STATIC" ] && [ -d "$artifacts_dir" ]; then
           cp -r "$out_dir/." "$artifacts_dir/" || error_exit "BUILD" "Failed to copy artifacts from $out_dir to $artifacts_dir"

     # Check if build was successful
          if [ ! "$(ls -A $artifacts_dir 2>/dev/null)" ]; then
             error_exit "BUILD" "Build failed - no artifacts generated in $artifacts_dir"
          fi
    fi

    log "BUILD" "Build completed successfully with filtered environment"
}

validate_orchestrator_response(){
    local status_code=$1
    local res_file=$2
    local error_msg="Failed to get clone URI from orchestrator"
     
    # Check HTTP status first
    if [[ "$status_code" -ge 400 ]]; then
        if [[ -f "$res_file" ]] && [[ -s "$res_file" ]] && jq empty "$res_file" 2>/dev/null; then
            local api_error=$(jq -r '.message // .error // empty' "$res_file" 2>/dev/null)
            if [[ -n "$api_error" ]]; then
                error_msg="$api_error"
            fi
        fi
        error_exit "SYSTEM" "$error_msg"
    fi
    
    # For successful HTTP status, check if response indicates error
    if [[ -f "$res_file" ]] && [[ -s "$res_file" ]] && jq empty "$res_file" 2>/dev/null; then
        # Check if res is null (indicates error even with 200)
        if jq -e '.res == null' "$res_file" >/dev/null 2>&1; then
            local body_error=$(jq -r '.message // .error // "Failed to get creds from orchestrator"' "$res_file")
            error_exit "SYSTEM" "$body_error"
        fi
    else
        error_exit "SYSTEM" "$error_msg"
    fi
}

get_clone_uri(){


   local http_code=$(curl "$ORCHESTRATOR_URL/containers/repo/clone-uri" \
        -H "Authorization: Bearer $CLONE_TOKEN" \
        -s -w "%{http_code}" -o /tmp/creds.json)
    
    # Check curl command itself (network errors)
    if [[ $? -ne 0 ]]; then
        error_exit "SYSTEM" "Failed to connect to orchestrator"
    fi

    # Validate response
    validate_orchestrator_response "$http_code" "/tmp/creds.json"

    # If we reach here, credentials are valid
    value=$(jq -r '.res.REPO_CLONE_URI' /tmp/creds.json)
    export REPO_CLONE_URI="$value"

    log "SYSTEM" "Clone URI loaded successfully" 
}

enforce_build_time_limit(){
    local INTERVAL=10
    local END=$((SECONDS+300))
    
    while [ $SECONDS -lt $END ]; do
       if [ "$BUILD_COMPLETED" = true ]; then
          return
       fi
       sleep $INTERVAL
    done
    error_exit "BUILD" "5 minute build time limit exceeded"
}