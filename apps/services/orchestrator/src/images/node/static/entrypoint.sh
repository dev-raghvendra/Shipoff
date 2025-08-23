#!/bin/sh


set -e

log(){
    local phase=$1
    local message=$2
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S:%MS')
    
    case $phase in
       SYSTEM)
        echo "[$timestamp] SYSTEM: $message"
        ;;
       BUILD)
        echo "[$timestamp] BUILD: $message"
        ;;
       RUNTIME)
        echo "[$timestamp] RUNTIME: $message"
        ;;
    esac
}

error_exit(){
    local phase=$1
    local message=$2
    log $phase "ERROR: ❌ $message"
    exit 1
}

push_to_bucket(){
    local domain=$1

}

log "SYSTEM" "📁 Cloning repository: $REPO_URI"

if ! git clone "$REPO_URI" ./app 2>/var/log/git.log; then 
   error_exit "BUILD" "Failed to clone repository"
fi


log "SYSTEM" "📤 Deploying artifacts to $DOMAIN"

eval "aws s3 cp  ./app/$OUT_DIR s3://$BUCKET_NAME/STATIC-APPS/$DOMAIN/ --recursive --endpoint-url $ENDPOINT_URL" 2>/var/log/aws.log || error_exit "RUNTIME" "Failed to deploy artifacts to $DOMAIN"

log "SYSTEM" "✅ Deployment completed successfully"