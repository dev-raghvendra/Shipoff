#!/bin/bash

graceful_shutdown(){
     local reason="UNKNOWN"
     if [[ -f /tmp/shutdown_reason ]]; then
        reason=$(cat /tmp/shutdown_reason)
        rm -f /tmp/shutdown_reason
    fi
    case "$reason" in
        "MEMORY_LIMIT_EXCEEDED")
            log "SYSTEM" "ERROR" "Memory limit exceeded, initiating graceful shutdown"
            send_webhook "STATE_CHANGED" "$FAILED_WEBHOOK"
            ;;
        "BUILD_TIMEOUT")
            log "SYSTEM" "ERROR" "Build time limit exceeded, initiating graceful shutdown"
            send_webhook "STATE_CHANGED" "$FAILED_WEBHOOK"
            ;;
        "SERVER_STARTUP_TIMEOUT")
            log "SYSTEM" "ERROR" "Server startup time limit exceeded, initiating graceful shutdown"
            send_webhook "STATE_CHANGED" "$FAILED_WEBHOOK"
            ;;
        *)
            log "SYSTEM" "INFO" "Graceful shutdown initiated: $reason"
            send_webhook "STATE_CHANGED" "$TERMINATED_WEBHOOK"
            ;;
    esac
    exit 0
}

