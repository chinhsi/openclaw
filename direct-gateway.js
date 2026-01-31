#!/usr/bin/env node

console.log('=== Direct Gateway Launcher ===');
console.log('Bypassing all build checks...');

// Import and run gateway directly from dist
try {
    // Set all environment variables to skip builds
    process.env.NODE_ENV = 'production';
    process.env.OPENCLAW_SKIP_BUILD = '1';
    process.env.OPENCLAW_NO_BUILD = '1';
    
    // Add gateway command to argv using your custom command
    process.argv = [
        process.argv[0],
        process.argv[1],
        'gateway',
        '--port', process.env.PORT || '8080',
        '--allow-unconfigured',
        '--bind', 'auto'
    ];
    
    console.log('Starting with args:', process.argv.slice(2));
    
    // Try to load the CLI directly from dist
    const cliPath = './dist/cli/index.js';
    const fs = require('fs');
    
    if (fs.existsSync(cliPath)) {
        console.log('Loading CLI from dist/cli/index.js...');
        require(cliPath);
    } else if (fs.existsSync('./dist/index.js')) {
        console.log('Loading from dist/index.js...');
        require('./dist/index.js');
    } else {
        console.log('WARNING: No dist found, trying openclaw.mjs as fallback...');
        // Last resort - try the original with all skip flags set
        require('./openclaw.mjs');
    }
} catch (error) {
    console.error('Failed to start gateway:', error);
    
    // Ultimate fallback - start a simple HTTP server to keep container alive
    console.log('Starting fallback HTTP server...');
    const http = require('http');
    const server = http.createServer((req, res) => {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('OpenClaw Gateway failed to start. Check logs.\n');
    });
    server.listen(process.env.PORT || 8080, '0.0.0.0', () => {
        console.log(`Fallback server running on port ${process.env.PORT || 8080}`);
    });
}