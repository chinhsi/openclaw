#!/bin/sh
set -e

echo "=== OpenClaw Gateway with Custom Command ==="

# Set skip build flags
export NODE_ENV=production
export OPENCLAW_SKIP_BUILD=1
export OPENCLAW_NO_BUILD=1
export OPENCLAW_BUILT=1
export PORT=${PORT:-8080}

echo "Using your custom startup command:"
echo "node scripts/run-node.mjs gateway --port $PORT --allow-unconfigured --bind auto"

# Execute your exact command
exec node scripts/run-node.mjs gateway --port $PORT --allow-unconfigured --bind auto