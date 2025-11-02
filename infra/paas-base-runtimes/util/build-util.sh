#!/bin/bash

run_filtered_build() {
    local repo_dir=$1
    local build_command=$2
    local out_dir=$3
    local app_type=$4
    local artifacts_dir=$5

    # Create necessary directories
    if [ "$app_type" = "STATIC" ]; then
        mkdir -p "$artifacts_dir"
    fi

    if [ -z "$build_command" ]; then
        error_exit "SYSTEM" "No build command specified"
    fi

    log "SYSTEM" "INFO" "Starting build with: $build_command"

    echo "#!/bin/bash
    $build_command
    " > /tmp/build_command.sh
    chmod +x /tmp/build_command.sh

    # Execute build command with filtered environment
    cd "$repo_dir"

    # Build the complete env command with proper argument handling
    local env_cmd="env"

    # Add unset flags for blacklisted variables
    for blocked_var in $BLOCKED_ENVS; do
        env_cmd="$env_cmd -u $blocked_var"
    done

    mkfifo /tmp/build_stdout /tmp/build_stderr

    # Start loggers in background
    while IFS= read -r line; do log "BUILD" "INFO" "$line"; done < /tmp/build_stdout &
    STDOUT_LOGGER_PID=$!

    while IFS= read -r line; do log "BUILD" "ERROR" "$line" >&2; done < /tmp/build_stderr &
    STDERR_LOGGER_PID=$!

    # Run the actual build command
    eval "$env_cmd sh -c 'exec /tmp/build_command.sh'" > /tmp/build_stdout 2> /tmp/build_stderr &
    BUILD_PID=$!
    echo $BUILD_PID > "$BUILD_PID_PATH"

    # Now wait for the actual build process
    wait $BUILD_PID || true
    build_exit_code=$?


    # Cleanup
    kill $STDOUT_LOGGER_PID $STDERR_LOGGER_PID 2>/dev/null || true
    rm -f /tmp/build_stdout /tmp/build_stderr

    # Check if build failed and exit with same code
    if [ $build_exit_code -ne 0 ]; then
        error_exit "SYSTEM" "Build failed with exit code $build_exit_code"
    fi

    if [ "$app_type" = "STATIC" ] && [ ! -d "$out_dir" ]; then
        error_exit "SYSTEM" "Output directory $out_dir does not exist"
    fi

    if [ "$app_type" = "STATIC" ] && [ -d "$artifacts_dir" ]; then
        cp -r "$out_dir/." "$artifacts_dir/" || error_exit "SYSTEM" "Failed to copy artifacts from $out_dir to $artifacts_dir"

        # Check if build was successful
        if [ ! "$(ls -A $artifacts_dir 2>/dev/null)" ]; then
            error_exit "SYSTEM" "Build failed - no artifacts generated in $artifacts_dir"
        fi
    fi

    log "SYSTEM" "SUCCESS" "Build completed successfully"
}

validate_orchestrator_response() {
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

get_clone_uri() {
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

    log "SYSTEM" "INFO" "Clone URI loaded successfully"
}

enforce_build_time_limit() {
    local main_pid=$1
    local INTERVAL=10
    local END=$((SECONDS+300))

    while [ $SECONDS -lt $END ]; do
        if ! kill -0 "$BUILD_PID" 2>/dev/null; then
            return 
        fi
        sleep $INTERVAL
    done
    kill -9 $BUILD_PID 2>/dev/null || true
    echo "BUILD_TIMEOUT" > /tmp/shutdown_reason
    kill -TERM $main_pid
}

backup_artifacts() {
    mkdir -p "$ROLLBACK_DIR"
    if ! aws s3 sync "$BUCKET_URI" "$ROLLBACK_DIR" --endpoint-url "$BUCKET_ENDPOINT" 2>/var/log/aws.log; then
        error_exit "SYSTEM" "Failed to fetch existing artifacts"
    fi
}

rollback_deployment() {
    log "SYSTEM" "INFO" "Initiating rollback to previous stable version"
    if [ ! -d "$ROLLBACK_DIR" ] || [ -z "$(ls -A $ROLLBACK_DIR 2>/dev/null)" ]; then
        error_exit "SYSTEM" "No previous stable version found for rollback"
    fi
    if ! aws s3 sync "$ROLLBACK_DIR" "$BUCKET_URI" --endpoint-url "$BUCKET_ENDPOINT" 2>/var/log/aws.log; then
        error_exit "SYSTEM" "Rollback failed: unable to restore previous artifacts"
    fi
    log "SYSTEM" "SUCCESS" "Rollback completed successfully"
}
