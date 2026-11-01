// Local preview of the site, as GitHub Pages would serve it:
// `node serve.js`, then open http://127.0.0.1:5130/
// Port 5130 is registered in the machine's port registry (server-start).
const http = require('http');
const fs = require('fs');
const path = require('path');

const dir = __dirname;
const port = Number(process.env.PORT) || 5130;

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript',
  '.txt': 'text/plain; charset=utf-8',
  '.ico': 'image/x-icon',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2'
};

http.createServer((req, res) => {
  let urlPath;
  try { urlPath = decodeURIComponent(req.url.split('?')[0]); } catch { res.writeHead(400); res.end('Bad request'); return; }
  // A NUL byte makes fs.stat throw synchronously, which would kill the server.
  if (urlPath.includes('\0')) { res.writeHead(400); res.end('Bad request'); return; }
  if (urlPath.endsWith('/')) urlPath += 'index.html';
  const filePath = path.join(dir, urlPath);
  // Stay inside the site folder.
  if (!filePath.startsWith(dir + path.sep)) { res.writeHead(403); res.end('Forbidden'); return; }
  fs.stat(filePath, (statErr, stat) => {
    // A folder without a trailing slash redirects, as GitHub Pages does.
    if (!statErr && stat.isDirectory()) { res.writeHead(301, { Location: urlPath + '/' }); res.end(); return; }
    fs.readFile(filePath, (err, data) => {
      if (err) { res.writeHead(404); res.end('Not found'); return; }
      res.writeHead(200, { 'Content-Type': mimeTypes[path.extname(filePath)] || 'application/octet-stream' });
      res.end(data);
    });
  });
}).listen(port, '127.0.0.1', () => console.log(`Serving ${dir} at http://127.0.0.1:${port}/`));
