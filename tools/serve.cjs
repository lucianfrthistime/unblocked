const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const {server: wisp} = require('@mercuryworkshop/wisp-js/server');

const root = path.resolve(__dirname, '..');
const portIndex = process.argv.indexOf('--port');
const port = portIndex < 0 ? 8000 : Number(process.argv[portIndex + 1]);
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('Invalid port');
const types = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript',
  '.mjs': 'text/javascript', '.wasm': 'application/wasm',
  '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon', '.webp': 'image/webp', '.woff2': 'font/woff2',
};
const server = http.createServer(async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (!['GET', 'HEAD'].includes(req.method)) {
    res.writeHead(405, {Allow: 'GET, HEAD'}).end();
    return;
  }
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    let file = path.resolve(root, '.' + pathname);
    if (!file.startsWith(root + path.sep) && file !== root) {
      res.writeHead(403).end();
      return;
    }
    if ((await fs.promises.stat(file)).isDirectory()) file = path.join(file, 'index.html');
    const body = await fs.promises.readFile(file);
    res.writeHead(200, {
      'Content-Type': types[path.extname(file).toLowerCase()] || 'application/octet-stream',
      'Content-Length': body.length,
    });
    res.end(req.method === 'HEAD' ? undefined : body);
  } catch (error) {
    res.writeHead(error.code === 'ENOENT' || error.code === 'ENOTDIR' ? 404 : 400).end();
  }
});
server.on('upgrade', (req, socket, head) => {
  if (req.url !== '/' || (req.headers.origin && ![
    `http://127.0.0.1:${port}`, `http://localhost:${port}`,
  ].includes(req.headers.origin))) {
    socket.end('HTTP/1.1 403 Forbidden\r\nConnection: close\r\n\r\n');
    return;
  }
  wisp.routeRequest(req, socket, head);
});
server.listen(port, '127.0.0.1', () => {
  console.log(`Local site and Wisp backend: http://127.0.0.1:${port}`);
});
