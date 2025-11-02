#!/bin/bash

monitor_memory_limit() {
  local main_pid=$1
  cat /sys/fs/cgroup/memory.current
  while true; do
    current=$(< /sys/fs/cgroup/memory.current)
    if [ "$current" -ge "$INSTANCE_MEMORY_LIMIT" ]; then
      echo "MEMORY_LIMIT_EXCEEDED" > /tmp/shutdown_reason
      kill -TERM "$main_pid"
      exit 0
    fi
    sleep 5
  done &
}
