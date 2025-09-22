#!/bin/bash

set -e

source /webhook-util.sh
source /log-util.sh
source /build-util.sh
source /prod-util.sh
source /health-check-util.sh
source /shutdown-util.sh
source /res-monitoring-util.sh

BLOCKED_ENVS="DOMAIN REPO_BRANCH REPO_CLONE_URI ORCHESTRATOR_URL GITHUB_REPO_FULLNAME CONTAINER_ID WEBHOOK_URI   FAILED_WEBHOOK PROVISIONING_WEBHOOK RUNNING_WEBHOOK PRODUCTION_WEBHOOK TERMINATED_WEBHOOK  CLONE_TOKEN BUILD_COMPLETED MEMORY_LIMIT COMMIT_HASH"

BUILD_COMPLETED="false"
CRR_ENV_ID=$BUILD_ID

trap graceful_shutdown SIGTERM SIGINT
monitor_memory_limit $MEMORY_LIMIT

enforce_build_time_limit &
send_webhook "STATE_CHANGED" "$PROVISIONING_WEBHOOK"
get_clone_uri
log "SYSTEM" "INFO" "📁 Cloning repository https://github.com/$GITHUB_REPO_FULLNAME with branch $REPO_BRANCH" "$BUILD_ID"
REPO_DIR="/app/repo"
chown -R containeruser:containergroup /app \
   && chmod -R 755 /
   && chmod -R 700 /app

if ! git clone --branch "$REPO_BRANCH" --single-branch "$REPO_CLONE_URI" "$REPO_DIR" 2>/var/log/git.log; then
   error_exit "BUILD" "Failed to clone repository: either the branch or repo does not exists or user hasn't granted access to it" "$BUILD_ID"
fi

send_webhook "STATE_CHANGED" "$RUNNING_WEBHOOK"
cd "$REPO_DIR"
git checkout "$COMMIT_HASH"
run_filtered_build "$REPO_DIR" "$BUILD_COMMAND" "$OUT_DIR"
BUILD_COMPLETED="true"

log "SYSTEM" "INFO" "📤 Deploying artifacts to $DOMAIN" "$BUILD_ID"

CRR_ENV_ID=$RUNTIME_ID
send_health_check  &
run_filtered_prod "$REPO_DIR" "$PROD_COMMAND"



