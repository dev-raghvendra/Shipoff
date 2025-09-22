#!/bin/bash

monitor_memory_limit(){
    local memory_limit_bytes=$1
    echo "$memory_limit_bytes" > /sys/fs/cgroup/memory.high
   
    tail -F /sys/fs/cgroup/memory.events | while read line; do
      if echo "$line" | grep -q "high"; then
        log "SYSTEM" "ERROR" "Memory limit exceeded, initiating graceful shutdown" "$CRR_ENV_ID"
        graceful_exit
      fi
    done &
}