import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3000;
const BASE_PATH = process.env.BASE_PATH || '/';

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'font/eot',
};

const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Content-Security-Policy': [
    "default-src 'self'",
    "base-uri 'none'",
    "object-src 'none'",
    "frame-ancestors 'self'",
    "script-src 'self'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com",
    "font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com",
    "img-src 'self' data:",
    "connect-src 'self' https://formspree.io",
    "form-action 'self' https://formspree.io",
  ].join('; '),
};

function send(res, statusCode, headers, body = '') {
  res.writeHead(statusCode, { ...SECURITY_HEADERS, ...headers });
  res.end(body);
}

const server = http.createServer((req, res) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    send(res, 405, { Allow: 'GET, HEAD', 'Content-Type': 'text/plain; charset=utf-8' }, 'Method not allowed');
    return;
  }

  let requestPath;
  try {
    const rawPath = (req.url || '/').split('?')[0];
    let decodedRawPath = rawPath;
    for (let i = 0; i < 3; i += 1) {
      const nextPath = decodeURIComponent(decodedRawPath);
      if (nextPath === decodedRawPath) break;
      decodedRawPath = nextPath;
    }
    if (decodedRawPath.split('/').includes('..') || decodedRawPath.includes('\0')) {
      send(res, 403, { 'Content-Type': 'text/plain; charset=utf-8' }, 'Forbidden');
      return;
    }
    requestPath = decodedRawPath;
  } catch {
    send(res, 400, { 'Content-Type': 'text/plain; charset=utf-8' }, 'Bad request');
    return;
  }

  if (BASE_PATH !== '/' && requestPath.startsWith(BASE_PATH)) {
    requestPath = requestPath.slice(BASE_PATH.length - 1);
  }
  if (requestPath === '/' || requestPath === '') requestPath = '/index.html';

  const fullPath = path.resolve(__dirname, `.${requestPath}`);
  const relativePath = path.relative(__dirname, fullPath);
  if (relativePath.startsWith('..') || path.isAbsolute(relativePath)) {
    send(res, 403, { 'Content-Type': 'text/plain; charset=utf-8' }, 'Forbidden');
    return;
  }

  const ext = path.extname(fullPath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(fullPath, (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        send(res, 404, { 'Content-Type': 'text/plain; charset=utf-8' }, 'Not found');
      } else {
        send(res, 500, { 'Content-Type': 'text/plain; charset=utf-8' }, 'Server error');
      }
      return;
    }
    send(res, 200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-store',
    }, req.method === 'HEAD' ? '' : data);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Static server running on port ${PORT}`);
});
