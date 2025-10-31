#!/bin/bash

send_health_check (){
    local main_pid=$1
    local END=$((SECONDS+300))
    local INTERVAL=10

    if [ -z "$PORT" ]; then
        error_exit "RUNTIME" "PORT environment variable not specified"
    fi

    while [ $SECONDS -lt $END ]; do
       if curl -s --head --request GET "http://localhost:$PORT" >/dev/null;then
         send_webhook "STATE_CHANGED"  "$PRODUCTION_WEBHOOK"
         log "RUNTIME" "SUCCESS" "Deployment completed successfully" 
         return
       fi
       sleep $INTERVAL
    done
    echo "SERVER_STARTUP_TIMEOUT" > /tmp/shutdown_reason
    kill -TERM $main_pid
}

