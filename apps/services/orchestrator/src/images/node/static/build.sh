#!/bin/sh
set -e

# Set up environment variables (all except blocked ones)
$build_env

# Remove blocked environment variables (double safety)
for blocked_var in $BUILD_BLOCKED_ENVS; do
    unset "\$blocked_var" 2>/dev/null || true
done

# Set working directory
cd "$REPO_DIR"

# Execute the build command
$BUILD_COMMAND

# Copy artifacts to output directory
if [ -d "$OUT_DIR" ]; then
    cp -r "$OUT_DIR"/* "$ARTIFACTS_DIR"/ 2>/dev/null || echo "No artifacts to copy"
else
    echo "Warning: Output directory $OUT_DIR not found"
fi