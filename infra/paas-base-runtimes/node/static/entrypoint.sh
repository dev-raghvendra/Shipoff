#!/bin/bash

set -e


source /webhook-util.sh
source /log-util.sh
source /build-util.sh
source /shutdown-util.sh
source /res-monitoring-util.sh


# Define sensitive environment variables to unset from build process
BLOCKED_ENVS="AWS_ACCESS_KEY_ID AWS_SECRET_ACCESS_KEY BUCKET_NAME BUCKET_ENDPOINT BUCKET_URI DOMAIN REPO_BRANCH  ORCHESTRATOR_URL GITHUB_REPO_FULLNAME AWS_RESPONSE_CHECKSUM_VALIDATION AWS_REQUEST_CHECKSUM_CALCULATION CONTAINER_ID WEBHOOK_URI FAILED_WEBHOOK PROVISIONING_WEBHOOK RUNNING_WEBHOOK PRODUCTION_WEBHOOK TERMINATED_WEBHOOK CLONE_TOKEN PROJECT_ID REPO_CLONE_URI  SOFT_MEMORY_LIMIT COMMIT_HASH BUILD_ID CURR_ENV_ID ENVIRONMENT_TYPE INSTANCE_MEMORY_LIMIT APPLICATION_MEMORY_LIMIT"

INSTANCE_MEMORY_LIMIT=$((SOFT_MEMORY_LIMIT))
APPLICATION_MEMORY_LIMIT=$((SOFT_MEMORY_LIMIT - 200*1024*1024))
NODE_OPTIONS="--max-old-space-size=$APPLICATION_MEMORY_LIMIT"

UPLOAD_PID_PATH="/tmp/upload_pid"
BUILD_PID_PATH="/tmp/build_pid"
CURR_ENV_ID=$BUILD_ID

trap graceful_shutdown SIGTERM SIGINT

monitor_memory_limit $$ 

send_webhook "STATE_CHANGED" "$PROVISIONING_WEBHOOK"
get_clone_uri

log "SYSTEM" "INFO" "Cloning repository https://github.com/$GITHUB_REPO_FULLNAME with branch $REPO_BRANCH" 

# Set up directories
REPO_DIR="/app/repo"
ARTIFACTS_DIR="/app/artifacts"
ROLLBACK_DIR="/app/rollback"

export AWS_REQUEST_CHECKSUM_CALCULATION=when_required
export AWS_RESPONSE_CHECKSUM_VALIDATION=when_required


# Clean any existing directories
rm -rf "$REPO_DIR" "$ARTIFACTS_DIR" 2>/dev/null || true
backup_artifacts

# Clone repository
if ! git clone --branch "$REPO_BRANCH" --single-branch "$REPO_CLONE_URI" "$REPO_DIR" 2>/var/log/git.log; then
   error_exit "BUILD" "Failed to clone repository: either the branch or repo does not exists or user hasn't granted access to it" 
fi

send_webhook "STATE_CHANGED" "$RUNNING_WEBHOOK"

# Run filtered build
cd "$REPO_DIR"
git checkout "$COMMIT_HASH"
run_filtered_build "$REPO_DIR" "$BUILD_COMMAND" "$OUT_DIR" "STATIC" "$ARTIFACTS_DIR"

log "SYSTEM" "INFO" "Deploying artifacts to $DOMAIN" 

cd "$ARTIFACTS_DIR"

if ! aws s3 sync . "$BUCKET_URI"  --endpoint-url "$BUCKET_ENDPOINT"  2>/var/log/aws.log; then
    error_exit "BUILD" "Failed to deploy artifacts to $DOMAIN" 
fi 
UPLOAD_PID=$!
echo $UPLOAD_PID > "$UPLOAD_PID_PATH"

send_webhook "STATE_CHANGED" "$PRODUCTION_WEBHOOK"
log "SYSTEM" "SUCCESS" "Deployment completed successfully" 

exit 0