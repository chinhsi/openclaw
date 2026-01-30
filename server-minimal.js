#!/usr/bin/env node

// Ultra-minimal server for debugging Zeabur deployment
const http = require('http');

const PORT = process.env.PORT || 8080;

console.log('=== OpenClaw Minimal Server Starting ===');
console.log('PORT:', PORT);
console.log('NODE_VERSION:', process.version);
console.log('ENVIRONMENT:', process.env.NODE_ENV);
console.log('Current directory:', process.cwd());
console.log('Files in directory:', require('fs').readdirSync('.').slice(0, 10));

// Create a simple HTTP server first to verify basic connectivity
const server = http.createServer((req, res) => {
  console.log(`Request received: ${req.method} ${req.url}`);
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('OpenClaw is starting...\n');
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`HTTP server listening on port ${PORT}`);
  console.log('Server is healthy and running!');
  
  // After confirming basic server works, try to load OpenClaw
  setTimeout(() => {
    console.log('Attempting to load OpenClaw modules...');
    try {
      // Check if the scripts exist
      const fs = require('fs');
      const path = require('path');
      
      const scriptPath = path.join(__dirname, 'scripts/run-node.mjs');
      if (!fs.existsSync(scriptPath)) {
        console.error('ERROR: scripts/run-node.mjs not found!');
        console.log('Available files in scripts:', 
          fs.existsSync('./scripts') ? fs.readdirSync('./scripts') : 'scripts directory not found');
        return;
      }
      
      // Check if dist exists
      if (!fs.existsSync('./dist')) {
        console.error('WARNING: dist directory not found - build may have failed');
        console.log('Attempting to run without build...');
      }
      
      console.log('Script found, attempting to import...');
      // Don't actually start the full gateway yet, just test loading
      
    } catch (error) {
      console.error('Failed to load OpenClaw:', error);
      console.error('Stack trace:', error.stack);
    }
  }, 2000);
});

// Handle errors
server.on('error', (error) => {
  console.error('Server error:', error);
  process.exit(1);
});

// Keep process alive
process.on('SIGTERM', () => {
  console.log('Received SIGTERM');
  server.close(() => process.exit(0));
});

process.on('SIGINT', () => {
  console.log('Received SIGINT');
  server.close(() => process.exit(0));
});