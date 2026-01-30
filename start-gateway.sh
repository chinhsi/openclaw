#!/bin/sh

# Start script for OpenClaw Gateway on Zeabur
echo "Starting OpenClaw Gateway..."
echo "PORT: ${PORT:-8080}"
echo "NODE_ENV: ${NODE_ENV}"

# Ensure the gateway runs in foreground mode
exec node scripts/run-node.mjs gateway \
  --port "${PORT:-8080}" \
  --host "0.0.0.0" \
  --no-daemon