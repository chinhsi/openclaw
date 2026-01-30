#!/usr/bin/env node

// Direct gateway startup test
console.log('=== Gateway Test Starting ===');
console.log('Working directory:', process.cwd());
console.log('Script directory:', __dirname);

const { spawn } = require('child_process');
const path = require('path');

// Try to find openclaw.mjs
const possiblePaths = [
  './openclaw.mjs',
  path.join(__dirname, 'openclaw.mjs'),
  path.join(process.cwd(), 'openclaw.mjs')
];

let openclawPath = null;
const fs = require('fs');

for (const p of possiblePaths) {
  console.log(`Checking: ${p}`);
  if (fs.existsSync(p)) {
    openclawPath = p;
    console.log(`Found openclaw at: ${p}`);
    break;
  }
}

if (!openclawPath) {
  console.error('ERROR: Could not find openclaw.mjs');
  console.log('Files in current directory:', fs.readdirSync('.').filter(f => f.endsWith('.mjs')));
  process.exit(1);
}

// Run the gateway command
console.log('Starting gateway with command:');
console.log(`node ${openclawPath} gateway --port 8080 --host 0.0.0.0 --force`);

const gateway = spawn('node', [
  openclawPath, 
  'gateway',
  '--port', '8080',
  '--host', '0.0.0.0',
  '--force'
], {
  stdio: 'inherit',
  env: {
    ...process.env,
    PORT: '8080',
    OPENCLAW_SKIP_CHANNELS: '1'
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

// Keep the process alive
process.on('SIGTERM', () => {
  console.log('SIGTERM received');
  gateway.kill('SIGTERM');
});

process.on('SIGINT', () => {
  console.log('SIGINT received');
  gateway.kill('SIGINT');
});