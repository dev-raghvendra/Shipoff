#!/bin/bash

graceful_shutdown(){
     local reason="INACTIVE_FOR_15_MINUTES"
     if [[ -f /tmp/shutdown_reason ]]; then
        reason=$(cat /tmp/shutdown_reason)
        rm -f /tmp/shutdown_reason
    fi
    local build_pid=$(cat "$BUILD_PID_PATH" 2>/dev/null)
    local upload_pid=$(cat "$UPLOAD_PID_PATH" 2>/dev/null)
    kill -9 "$build_pid" "$upload_pid" 2>/dev/null || true
    rm -f "$BUILD_PID_PATH" "$UPLOAD_PID_PATH"
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
    if [ "$BUILD_PID" ] && [ "$PROJECT_TYPE" = "STATIC" ]; then
        rollback_deployment
    fi
    exit 0
}

