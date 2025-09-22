#!/bin/bash

run_filtered_prod(){
    local working_dir=$1
    local prod_command=$2

    local env_cmd="env"

    for blocked_var in $BLOCKED_ENVS; do
        env_cmd="$env_cmd -u $blocked_var"
    done
    cd "$working_dir"

    env_cmd="$env_cmd WORKING_DIR=$working_dir"

    log "RUNTIME" "INFO" "Starting production with command: $prod_command" "$RUNTIME_ID"
    # eval "$env_cmd sh -c '$prod_command'" \
    #     2> >(while IFS= read -r line; do log "RUNTIME" "ERROR: $line"; done) \
    #     | while IFS= read -r line; do log "RUNTIME" "$line"; done
    # prod_exit_code=${PIPESTATUS[0]}
    su-exec containeruser bash -c "
eval \"$env_cmd bash -c '$prod_command'\" \
    2> >(while IFS= read -r line; do log 'RUNTIME' 'ERROR' \"\$line\"\"\$RUNTIME_ID\"; done) \
    | while IFS= read -r line; do log 'RUNTIME' 'INFO' \"\$line\"\"\$RUNTIME_ID\"; done
prod_exit_code=\${PIPESTATUS[0]}
exit \$prod_exit_code
"

    if [ $prod_exit_code -ne 0 ]; then
        error_exit "RUNTIME" "Production command failed with exit code $prod_exit_code" "$RUNTIME_ID"
    fi

}
