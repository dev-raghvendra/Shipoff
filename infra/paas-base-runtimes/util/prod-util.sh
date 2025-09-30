#!/bin/bash

run_filtered_prod() {
    local working_dir=$1
    local prod_command=$2

    local env_cmd="env"

    for blocked_var in $BLOCKED_ENVS; do
        env_cmd="$env_cmd -u $blocked_var"
    done

    cd "$working_dir"

    env_cmd="$env_cmd WORKING_DIR=$working_dir"

    if [ -z "$prod_command" ]; then
        error_exit "RUNTIME" "No production command specified"
    fi
    echo  "
    #!/bin/bash
    $prod_command
    " > /tmp/prod_command.sh
    chmod +x /tmp/prod_command.sh

    log "RUNTIME" "INFO" "Starting production with command: $prod_command"

    mkfifo /tmp/prod_stdout /tmp/prod_stderr

    # Start loggers in background
    while IFS= read -r line; do log "RUNTIME" "INFO" "$line"; done < /tmp/prod_stdout &
    STDOUT_LOGGER_PID=$!

    while IFS= read -r line; do log "RUNTIME" "ERROR" "$line" >&2; done < /tmp/prod_stderr &
    STDERR_LOGGER_PID=$!

    # Run the actual build command
    eval "$env_cmd sh -c 'exec /tmp/prod_command.sh'" > /tmp/prod_stdout 2> /tmp/prod_stderr &
    PROD_PID=$!

    # Now wait for the actual build process
    wait $PROD_PID || true
    prod_exit_code=$?

    if [ $prod_exit_code -ne 0 ]; then
        error_exit "RUNTIME" "Production command failed with exit code $prod_exit_code"
    fi
}
