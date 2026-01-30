// Simple wrapper for Zeabur deployment
const { spawn } = require('child_process');
const path = require('path');

const PORT = process.env.PORT || 3000;

console.log(`Starting OpenClaw on port ${PORT}...`);

// Try to run the gateway directly
const gateway = spawn('node', [
  path.join(__dirname, 'scripts/run-node.mjs'),
  'gateway',
  '--port', PORT.toString()
], {
  stdio: 'inherit',
  env: {
    ...process.env,
    PORT: PORT,
    OPENCLAW_SKIP_CHANNELS: '1',
    OPENCLAW_CONFIG_PATH: path.join(__dirname, 'openclaw.json')
  }
});

gateway.on('error', (err) => {
  console.error('Failed to start gateway:', err);
  process.exit(1);
});

gateway.on('exit', (code) => {
  console.log(`Gateway exited with code ${code}`);
  process.exit(code || 0);
});

// Handle termination signals
process.on('SIGTERM', () => {
  console.log('Received SIGTERM, shutting down gracefully...');
  gateway.kill('SIGTERM');
});

process.on('SIGINT', () => {
  console.log('Received SIGINT, shutting down gracefully...');
  gateway.kill('SIGINT');
});