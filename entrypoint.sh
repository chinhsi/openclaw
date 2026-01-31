#!/bin/sh
set -e

echo "=== OpenClaw Entrypoint Starting ==="
echo "Current directory: $(pwd)"
echo "NODE_ENV: $NODE_ENV"
echo "OPENCLAW_SKIP_BUILD: $OPENCLAW_SKIP_BUILD"

# Check if dist exists
if [ -d "./dist" ]; then
    echo "dist directory found ✓"
    ls -la dist/ | head -10
else
    echo "WARNING: dist directory not found!"
fi

echo ""
echo "Looking for openclaw.mjs..."
if [ -f "./openclaw.mjs" ]; then
    echo "Found openclaw.mjs, starting gateway..."
    # Add environment to skip build check
    export OPENCLAW_SKIP_BUILD=1
    export OPENCLAW_NO_BUILD=1
    echo "Command: node openclaw.mjs gateway --port 8080 --host 0.0.0.0"
    exec node openclaw.mjs gateway --port 8080 --host 0.0.0.0
else
    echo "ERROR: openclaw.mjs not found!"
    echo "Trying to run gateway directly with node..."
    # Try alternative paths
    if [ -f "./dist/cli/index.js" ]; then
        echo "Found dist/cli/index.js"
        exec node dist/cli/index.js gateway --port 8080 --host 0.0.0.0
    elif [ -f "./dist/index.js" ]; then
        echo "Found dist/index.js" 
        exec node dist/index.js gateway --port 8080 --host 0.0.0.0
    else
        echo "FATAL: Cannot find any entry point!"
        echo "Available .js files:"
        find . -name "*.js" -type f | head -20
        echo "Available .mjs files:"
        find . -name "*.mjs" -type f | head -20
        exit 1
    fi
fi