# ----------------------
# Builder Stage
# ----------------------
FROM node:20-slim AS builder

# Install build tools for native modules
RUN apt-get update && apt-get install -y python3 make g++ \
    && rm -rf /var/lib/apt/lists/*

# Install pnpm globally
RUN npm install -g pnpm

WORKDIR /app

# Copy package manifests first (for caching)
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc turbo.json ./

# Copy all necessary packages & service
COPY packages/services-commons ./packages/services-commons
COPY packages/proto           ./packages/proto
COPY packages/grpc-clients          ./packages/grpc-clients
COPY packages/typescript-config ./packages/typescript-config
COPY packages/types              ./packages/types
COPY packages/redis            ./packages/redis

COPY apps/services/projects ./apps/services/projects

# Install all dependencies (dev + prod) needed for building TS
RUN pnpm install -r \
    --filter . \
    --filter ./apps/services/projects \
    --filter ./packages/services-commons \
    --filter ./packages/proto \
    --filter ./packages/grpc-clients \
    --filter ./packages/types \
    --filter ./packages/typescript-config \
    --filter ./packages/redis

# Build TypeScript for the service
WORKDIR /app/apps/services/projects
RUN pnpm build


# ----------------------
# Runner Stage
# ----------------------
FROM node:20-slim AS runner

# Install pnpm globally
RUN apt-get update && apt-get install -y openssl \
    && rm -rf /var/lib/apt/lists/*

RUN npm install -g pnpm

WORKDIR /app

# Copy service dist + package.json
COPY --from=builder /app/apps/services/projects/dist ./apps/services/projects/dist
COPY --from=builder /app/apps/services/projects/package.json ./apps/services/projects/package.json

# Copy runtime packages needed for service
COPY --from=builder /app/packages/services-commons ./packages/services-commons
COPY --from=builder /app/packages/proto ./packages/proto
COPY --from=builder /app/packages/grpc-clients ./packages/grpc-clients
COPY --from=builder /app/packages/types ./packages/types
COPY --from=builder /app/packages/redis ./packages/redis

# Copy root manifests
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml

# Copy all node_modules from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/services/projects/node_modules ./apps/services/projects/node_modules

# Prune dev dependencies to shrink image
RUN pnpm prune --prod

# Set working directory for the service
WORKDIR /app/apps/services/projects

# Start the service
CMD ["pnpm", "start"]
