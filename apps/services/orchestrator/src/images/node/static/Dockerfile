FROM node:20-alpine

RUN apk add --no-cache \
    aws-cli \
    git \
    bash \
    curl \
    jq  \
    unzip \
    less \
    groff

RUN aws --version

WORKDIR /app

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh 

ENTRYPOINT ["/entrypoint.sh"]
