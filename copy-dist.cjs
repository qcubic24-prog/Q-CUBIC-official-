const fs = require('fs');
const path = require('path');

// Ensure dist exists
fs.mkdirSync('dist', { recursive: true });

// Ensure work.html is in dist
if (fs.existsSync('work.html')) {
  fs.copyFileSync('work.html', 'dist/work.html');
}

// Copy admin to dist/admin
if (fs.existsSync('admin')) {
  fs.cpSync('admin', 'dist/admin', { recursive: true });
}

// Copy src to dist/src (excluding temporary files)
if (fs.existsSync('src')) {
  fs.cpSync('src', 'dist/src', {
    recursive: true,
    filter: (p) => !p.endsWith('.previous') && !p.endsWith('.tmp'),
  });
}

console.log('✓ All assets, videos, company pages, and admin files copied to dist.');
