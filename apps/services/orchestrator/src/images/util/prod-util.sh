#!/bin/bash

run_filtered_prod(){
    local working_dir=$1
    local prod_command=$2

    local env_cmd="env"

    for blocked_var in $PROD_BLOCKED_ENVS; do
        env_cmd="$env_cmd -u $blocked_var"
    done
    cd "$working_dir"

    env_cmd="$env_cmd WORKING_DIR=$working_dir"

    log "RUNTIME" "Starting production with command: $prod_command"
    eval "$env_cmd sh -c '$prod_command'" \
        2> >(while IFS= read -r line; do log "RUNTIME" "ERROR: $line"; done) \
        | while IFS= read -r line; do log "RUNTIME" "$line"; done
    prod_exit_code=${PIPESTATUS[0]}

    if [ $prod_exit_code -ne 0 ]; then
        error_exit "RUNTIME" "Production command failed with exit code $prod_exit_code"
    fi

}
