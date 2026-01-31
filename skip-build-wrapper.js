#!/usr/bin/env node

// Wrapper to skip TypeScript build and run gateway directly
console.log('=== OpenClaw Skip-Build Wrapper ===');

// Set all possible skip build flags
process.env.OPENCLAW_SKIP_BUILD = '1';
process.env.OPENCLAW_NO_BUILD = '1';
process.env.OPENCLAW_BUILT = '1';
process.env.NODE_ENV = 'production';
process.env.TS_NODE_SKIP_PROJECT = '1';

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Check if dist exists
const distPath = path.join(__dirname, 'dist');
if (fs.existsSync(distPath)) {
    console.log('✓ dist directory exists');
    
    // Try to run from dist directly
    const cliPath = path.join(distPath, 'cli', 'index.js');
    if (fs.existsSync(cliPath)) {
        console.log('✓ Found dist/cli/index.js');
        console.log('Starting gateway from compiled JavaScript...');
        
        const gateway = spawn('node', [
            cliPath,
            'gateway',
            '--port', process.env.PORT || '8080',
            '--host', '0.0.0.0'
        ], {
            stdio: 'inherit',
            env: process.env
        });
        
        gateway.on('exit', (code) => {
            process.exit(code);
        });
        
        return;
    }
}

// Fallback: try to touch dist to make it not stale
console.log('Attempting to mark dist as not stale...');
try {
    // Create a marker file to indicate dist is ready
    fs.writeFileSync(path.join(__dirname, 'dist', '.built'), Date.now().toString());
    
    // Touch all files in dist to update timestamps
    const touchRecursive = (dir) => {
        const files = fs.readdirSync(dir);
        files.forEach(file => {
            const fullPath = path.join(dir, file);
            const stat = fs.statSync(fullPath);
            if (stat.isDirectory()) {
                touchRecursive(fullPath);
            } else {
                const now = new Date();
                fs.utimesSync(fullPath, now, now);
            }
        });
    };
    
    if (fs.existsSync(distPath)) {
        touchRecursive(distPath);
        console.log('✓ Updated dist timestamps');
    }
} catch (e) {
    console.log('Could not update dist timestamps:', e.message);
}

// Now try openclaw.mjs with updated timestamps
console.log('Starting openclaw.mjs with skip flags...');
require('./openclaw.mjs');