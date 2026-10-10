import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PRIMARY_PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const HOST = '0.0.0.0';

const DIST_DIR = path.join(__dirname, 'dist');
const PUBLIC_DIR = path.join(__dirname, 'public');
const indexPath = path.join(DIST_DIR, 'index.html');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.pdf': 'application/pdf',
  '.txt': 'text/plain; charset=utf-8',
};

function resolveFilePath(urlPath) {
  const cleanPath = decodeURIComponent(urlPath.split('?')[0]);
  
  // 1. Try dist folder
  const distPath = path.join(DIST_DIR, cleanPath);
  if (fs.existsSync(distPath) && fs.statSync(distPath).isFile()) {
    return distPath;
  }

  // 2. Try public folder
  const publicPath = path.join(PUBLIC_DIR, cleanPath);
  if (fs.existsSync(publicPath) && fs.statSync(publicPath).isFile()) {
    return publicPath;
  }

  // 3. Try root/src folder (for direct asset references like /src/assets/images/...)
  if (cleanPath.startsWith('/src/')) {
    const srcPath = path.join(__dirname, cleanPath);
    if (fs.existsSync(srcPath) && fs.statSync(srcPath).isFile()) {
      return srcPath;
    }
  }

  return null;
}

const server = http.createServer((req, res) => {
  // Health check endpoints for Cloud Run & Nginx
  if (req.url === '/_health' || req.url === '/healthz' || req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('OK');
    return;
  }

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, { 'Content-Type': 'text/plain' });
    res.end('Method Not Allowed');
    return;
  }

  const resolved = resolveFilePath(req.url);

  if (resolved) {
    const ext = path.extname(resolved).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    const isAsset = resolved.includes('/assets/');
    const cacheControl = isAsset 
      ? 'public, max-age=31536000, immutable' 
      : 'public, max-age=3600';

    try {
      const stat = fs.statSync(resolved);
      res.writeHead(200, {
        'Content-Type': contentType,
        'Content-Length': stat.size,
        'Cache-Control': cacheControl,
      });

      if (req.method === 'HEAD') {
        res.end();
        return;
      }

      const stream = fs.createReadStream(resolved);
      stream.pipe(res);
      return;
    } catch (err) {
      console.error(`Error reading file ${resolved}:`, err);
    }
  }

  // SPA Fallback: serve dist/index.html
  if (fs.existsSync(indexPath)) {
    try {
      const stat = fs.statSync(indexPath);
      res.writeHead(200, {
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Length': stat.size,
        'Cache-Control': 'no-cache',
      });

      if (req.method === 'HEAD') {
        res.end();
        return;
      }

      fs.createReadStream(indexPath).pipe(res);
      return;
    } catch (err) {
      console.error('Error serving index.html:', err);
    }
  }

  // Fallback while building
  res.writeHead(503, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('Application initializing. Please refresh in a moment.');
});

server.listen(PRIMARY_PORT, HOST, () => {
  console.log(`[Arogya] Production server running at http://${HOST}:${PRIMARY_PORT}`);
});

// If Cloud Run or external env sets PORT (e.g. 8080), also listen on 3000 for local proxy compatibility
if (PRIMARY_PORT !== 3000) {
  try {
    const secondaryServer = http.createServer((req, res) => {
      server.emit('request', req, res);
    });
    secondaryServer.listen(3000, HOST, () => {
      console.log(`[Arogya] Secondary listener active at http://${HOST}:3000`);
    });
  } catch (err) {
    console.warn('[Arogya] Could not bind secondary port 3000:', err?.message);
  }
}

process.on('SIGTERM', () => {
  console.log('[Arogya] SIGTERM received, shutting down gracefully');
  server.close(() => process.exit(0));
});

process.on('SIGINT', () => {
  console.log('[Arogya] SIGINT received, shutting down gracefully');
  server.close(() => process.exit(0));
});
