#!/bin/bash

send_webhook(){
    local event=$1
    local TOKEN=$2

    local http_code=$(curl -X POST "$WEBHOOK_URI" \
        -H "Content-Type: application/json" \
        -H "X-Orchestrator-Event: $event" \
        -d '{"payload":"'$TOKEN'"}' \
        -s -w "%{http_code}" -o /tmp/res.json)

    if [[ $? -ne 0 ]]; then
        echo "[SYSTEM] [ERROR] Failed to connect to orchestrator [$CRR_ENV_ID]"
        exit 1
    fi

    if [[ "$http_code" -ge 400 ]]; then
        local api_error=$(jq -r '.message // .error // empty' /tmp/res.json 2>/dev/null)
        if [[ -n "$api_error" ]]; then
            echo "[SYSTEM] [ERROR] $api_error [$CRR_ENV_ID]"
        else
            echo "[SYSTEM] [ERROR] Failed to notify orchestrator, HTTP status $http_code [$CRR_ENV_ID]"
        fi
        exit 1
    fi
}