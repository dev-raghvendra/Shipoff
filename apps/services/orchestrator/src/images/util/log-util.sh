#!/bin/bash

log(){
    local phase=$1
    local type=$2
    local message=$3
    local envId=$4
    local timestamp=$(date -u '+%Y-%m-%dT%H:%M:%S.%3NZ')
    
    case $phase in
       SYSTEM)
        echo "[$envId] [$timestamp] [SYSTEM] [$type]: $message"
        ;;
       BUILD)
        echo "[$envId] [$timestamp] [BUILD] [$type]: $message"
        ;;
       RUNTIME)
        echo "[$envId] [$timestamp] [RUNTIME] [$type]: $message"
        ;;
    esac
}

error_exit(){
    local phase=$1
    local message=$2
    local envId=$3
    log $phase "ERROR" $message  $envId
    log $phase "ERROR" "Operation failed." $envId
    send_webhook "STATE_CHANGED" "$FAILED_WEBHOOK"
    exit 1
}