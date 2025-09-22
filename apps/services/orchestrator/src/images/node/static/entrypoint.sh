#!/bin/bash

set -e

ls

source /webhook-util.sh
source /log-util.sh
source /build-util.sh
source /shutdown-util.sh
source /res-monitoring-util.sh

# Define sensitive environment variables to unset from build process
BLOCKED_ENVS="AWS_ACCESS_KEY_ID AWS_SECRET_ACCESS_KEY BUCKET_NAME BUCKET_ENDPOINT BUCKET_URI DOMAIN REPO_BRANCH  ORCHESTRATOR_URL GITHUB_REPO_FULLNAME AWS_RESPONSE_CHECKSUM_VALIDATION AWS_REQUEST_CHECKSUM_CALCULATION CONTAINER_ID WEBHOOK_URI FAILED_WEBHOOK PROVISIONING_WEBHOOK RUNNING_WEBHOOK PRODUCTION_WEBHOOK TERMINATED_WEBHOOK CLONE_TOKEN PROJECT_ID REPO_CLONE_URI BUILD_COMPLETED MEMORY_LIMIT COMMIT_HASH"
BUILD_COMPLETED="false"

CRR_ENV_ID=$BUILD_ID

trap graceful_shutdown SIGTERM SIGINT
trap graceful_shutdown SIGTERM SIGINT
monitor_memory_limit $MEMORY_LIMIT

# Main execution starts here
enforce_build_time_limit &
send_webhook "STATE_CHANGED" "$PROVISIONING_WEBHOOK"
get_clone_uri
log "SYSTEM" "INFO" "📁 Cloning repository https://github.com/$GITHUB_REPO_FULLNAME with branch $REPO_BRANCH" "$BUILD_ID"

# Set up directories
REPO_DIR="/app/repo"
ARTIFACTS_DIR="/app/artifacts"
export AWS_REQUEST_CHECKSUM_CALCULATION=when_required
export AWS_RESPONSE_CHECKSUM_VALIDATION=when_required
chown -R containeruser:containergroup /app \
   && chmod -R 755 /
   && chmod -R 700 /app

# Clean any existing directories
rm -rf "$REPO_DIR" "$ARTIFACTS_DIR" 2>/dev/null || true

# Clone repository
if ! git clone --branch "$REPO_BRANCH" --single-branch "$REPO_CLONE_URI" "$REPO_DIR" 2>/var/log/git.log; then
   error_exit "BUILD" "Failed to clone repository: either the branch or repo does not exists or user hasn't granted access to it" "$BUILD_ID"
fi

send_webhook "STATE_CHANGED" "$RUNNING_WEBHOOK"

# Run filtered build
cd "$REPO_DIR"
git checkout "$COMMIT_HASH"
run_filtered_build "$REPO_DIR" "$BUILD_COMMAND" "$OUT_DIR" "STATIC" "$ARTIFACTS_DIR"
BUILD_COMPLETED="true"

log "SYSTEM" "📤 Deploying artifacts to $DOMAIN"

cd "$ARTIFACTS_DIR"
if ! aws s3 sync . "$BUCKET_URI"  --endpoint-url "$BUCKET_ENDPOINT"  2>/var/log/aws.log; then
    error_exit "BUILD" "Failed to deploy artifacts to $DOMAIN" "$BUILD_ID"
fi

send_webhook "STATE_CHANGED" "$PRODUCTION_WEBHOOK"
log "SYSTEM" "SUCCESS" "✅ Deployment completed successfully" "$BUILD_ID"

# Final cleanup
rm -rf "$REPO_DIR" "$ARTIFACTS_DIR" 2>/dev/null || true