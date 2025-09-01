#!/bin/bash

send_health_check(){
    local container_id=$1
    local project_id=$2
    local domain=$3
    local port=$4
    local END=$((SECONDS+300))
    local INTERVAL=10

    while [ $SECONDS -lt $END ]; do
       if curl -s --head --request GET "http://localhost:$port" >/dev/null;then
         send_webhook "STATE_CHANGED"  "$PRODUCTION_WEBHOOK"
         break
       fi
       sleep $INTERVAL
    done
}