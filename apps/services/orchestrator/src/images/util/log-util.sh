#!/bin/bash

log(){
    local phase=$1
    local message=$2
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S:%MS')
    
    case $phase in
       SYSTEM)
        echo "[$timestamp] SYSTEM: $message"
        ;;
       BUILD)
        echo "[$timestamp] BUILD: $message"
        ;;
       RUNTIME)
        echo "[$timestamp] RUNTIME: $message"
        ;;
    esac
}

error_exit(){
    local phase=$1
    local message=$2
    log $phase "ERROR: ❌ $message"
    log $phase "Operation failed."
    send_webhook "STATE_CHANGED" "$FAILED_WEBHOOK"
    exit 1
}