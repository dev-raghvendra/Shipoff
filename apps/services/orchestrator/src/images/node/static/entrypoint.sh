#!/bin/bash

set -e

ls

source /webhook-util.sh
source /log-util.sh
source /build-util.sh

# Define sensitive environment variables to unset from build process
BUILD_BLOCKED_ENVS="AWS_ACCESS_KEY_ID AWS_SECRET_ACCESS_KEY BUCKET_NAME BUCKET_ENDPOINT BUCKET_URI DOMAIN REPO_BRANCH  ORCHESTRATOR_URL GITHUB_REPO_FULLNAME AWS_RESPONSE_CHECKSUM_VALIDATION AWS_REQUEST_CHECKSUM_CALCULATION CONTAINER_ID WEBHOOK_URI FAILED_WEBHOOK PROVISIONING_WEBHOOK RUNNING_WEBHOOK PRODUCTION_WEBHOOK TERMINATED_WEBHOOK CLONE_TOKEN PROJECT_ID REPO_CLONE_URI"



# Main execution starts here
send_webhook "STATE_CHANGED" "$PROVISIONING_WEBHOOK"
get_clone_uri
log "SYSTEM" "📁 Cloning repository https://github.com/$GITHUB_REPO_FULLNAME with branch $REPO_BRANCH"

# Set up directories
REPO_DIR="/app/repo"
ARTIFACTS_DIR="/app/artifacts"
export AWS_REQUEST_CHECKSUM_CALCULATION=when_required
export AWS_RESPONSE_CHECKSUM_VALIDATION=when_required

# Clean any existing directories
rm -rf "$REPO_DIR" "$ARTIFACTS_DIR" 2>/dev/null || true

# Clone repository
if ! git clone --branch "$REPO_BRANCH" --single-branch "$REPO_CLONE_URI" "$REPO_DIR" 2>/var/log/git.log; then
   error_exit "BUILD" "Failed to clone repository: either the branch or repo does not exists or user hasn't granted access to it"
fi

send_webhook "STATE_CHANGED" "$RUNNING_WEBHOOK"

# Run filtered build
run_filtered_build "$REPO_DIR" "$BUILD_COMMAND" "$OUT_DIR" "STATIC" "$ARTIFACTS_DIR"

log "SYSTEM" "📤 Deploying artifacts to $DOMAIN"

cd "$ARTIFACTS_DIR"
if ! aws s3 sync . "$BUCKET_URI"  --endpoint-url "$BUCKET_ENDPOINT"  2>/var/log/aws.log; then
    error_exit "RUNTIME" "Failed to deploy artifacts to $DOMAIN"
fi

send_webhook "STATE_CHANGED" "$PRODUCTION_WEBHOOK"
log "SYSTEM" "✅ Deployment completed successfully"

# Final cleanup
rm -rf "$REPO_DIR" "$ARTIFACTS_DIR" 2>/dev/null || true