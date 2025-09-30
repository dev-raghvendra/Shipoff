#!/bin/bash

monitor_memory_limit() {
  local main_pid=$1
  local soft_mem_limit=$((SOFT_MEMORY_LIMIT))
  cat /sys/fs/cgroup/memory.current
  while true; do
    current=$(< /sys/fs/cgroup/memory.current)
    if [ "$current" -ge "$soft_mem_limit" ]; then
      echo "MEMORY_LIMIT_EXCEEDED" > /tmp/shutdown_reason
      kill -TERM "$main_pid"
      exit 0
    fi
    sleep 5
  done &
}
