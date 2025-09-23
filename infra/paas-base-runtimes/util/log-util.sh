#!/bin/bash

log(){
    local phase=$1
    local type=$2
    local message=$3
    local timestamp=$(date -u '+%Y-%m-%dT%H:%M:%SZ')
    
    case $phase in
       SYSTEM)
        if [ "$ENVIRONMENT_TYPE" = "DEVELOPMENT" ]; then
            echo "[$CURR_ENV_ID] [$timestamp] [SYSTEM] [$type]: $message" >> /logs/user-static-apps/app.log
        else
            echo "[$CURR_ENV_ID] [$timestamp] [SYSTEM] [$type]: $message"
        fi
        ;;
       BUILD)
        if [ "$ENVIRONMENT_TYPE" = "DEVELOPMENT" ]; then
            echo "[$CURR_ENV_ID] [$timestamp] [BUILD] [$type]: $message" >> /logs/user-static-apps/app.log
        else
            echo "[$CURR_ENV_ID] [$timestamp] [BUILD] [$type]: $message"
        fi
        ;;
       RUNTIME)
        if [ "$ENVIRONMENT_TYPE" = "DEVELOPMENT" ]; then
            echo "[$CURR_ENV_ID] [$timestamp] [RUNTIME] [$type]: $message" >> /logs/user-static-apps/app.log
        else
            echo "[$CURR_ENV_ID] [$timestamp] [RUNTIME] [$type]: $message"
        fi
        ;;
       *)
        echo "[$CURR_ENV_ID] [$timestamp] [UNKNOWN] [$type]: $message"
        ;;
    esac
}



error_exit(){
    local phase=$1
    local message=$2
    log $phase "ERROR" "$message"
    log $phase "ERROR" "Operation failed."
    send_webhook "STATE_CHANGED" "$FAILED_WEBHOOK"
    exit 1
}