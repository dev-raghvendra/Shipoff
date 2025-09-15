#!/bin/bash

send_health_check(){
    local END=$((SECONDS+300))
    local INTERVAL=10

    while [ $SECONDS -lt $END ]; do
       if curl -s --head --request GET "http://localhost:$PORT" >/dev/null;then
         send_webhook "STATE_CHANGED"  "$PRODUCTION_WEBHOOK"
         log "RUNTIME" "Deployment completed successfully"
         return
       fi
       sleep $INTERVAL
    done
    error_exit "RUNTIME" "5 minute server startup time limit exceeded"
}

