#!/bin/bash

graceful_shutdown(){
    log "SYSTEM" "INFO" "Received termination signal, initiating graceful shutdown" "$CRR_ENV_ID"
    send_webhook "STATE_CHANGED" "$TERMINATED_WEBHOOK"
    exit 0
}

