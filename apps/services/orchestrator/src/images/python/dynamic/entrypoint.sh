#!/bin/bash

set -e

source /webhook-util.sh
source /log-util.sh
source /build-util.sh
source /prod-util.sh
source /health-check-util.sh

BUILD_BLOCKED_ENVS="DOMAIN REPO_BRANCH REPO_CLONE_URI ORCHESTRATOR_URL GITHUB_REPO_FULLNAME CONTAINER_ID WEBHOOK_URI   FAILED_WEBHOOK PROVISIONING_WEBHOOK RUNNING_WEBHOOK PRODUCTION_WEBHOOK TERMINATED_WEBHOOK  CLONE_TOKEN BUILD_COMPLETED"
PROD_BLOCKED_ENVS="DOMAIN REPO_BRANCH REPO_CLONE_URI ORCHESTRATOR_URL GITHUB_REPO_FULLNAME CONTAINER_ID WEBHOOK_URI  FAILED_WEBHOOK PROVISIONING_WEBHOOK RUNNING_WEBHOOK PRODUCTION_WEBHOOK TERMINATED_WEBHOOK  CLONE_TOKEN BUILD_COMPLETED"
BUILD_COMPLETED="false"

enforce_build_time_limit &
send_webhook "STATE_CHANGED" "$PROVISIONING_WEBHOOK"
get_clone_uri
log "SYSTEM" "📁 Cloning repository https://github.com/$GITHUB_REPO_FULLNAME with branch $REPO_BRANCH" 
REPO_DIR="/app/repo"

if ! git clone --branch "$REPO_BRANCH" --single-branch "$REPO_CLONE_URI" "$REPO_DIR" 2>/var/log/git.log; then
   error_exit "BUILD" "Failed to clone repository: either the branch or repo does not exists or user hasn't granted access to it"
fi

send_webhook "STATE_CHANGED" "$RUNNING_WEBHOOK"
cd "$REPO_DIR"
git checkout "$COMMIT_HASH"
run_filtered_build "$REPO_DIR" "$BUILD_COMMAND" "$OUT_DIR"
BUILD_COMPLETED="true"

log "SYSTEM" "📤 Deploying artifacts to $DOMAIN"

send_health_check  &
run_filtered_prod "$REPO_DIR" "$PROD_COMMAND"



