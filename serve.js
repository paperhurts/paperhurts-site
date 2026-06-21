const http = require('http');
const fs = require('fs');
const path = require('path');

const dir = 'C:\\paperhurts-site';
const port = 8080;

const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.txt': 'text/plain',
  '.ico': 'image/x-icon'
};

http.createServer((req, res) => {
  let file = req.url === '/' ? '/index.html' : req.url;
  let filePath = path.join(dir, file);
  let ext = path.extname(filePath);
  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404); res.end('Not found'); return; }
    res.writeHead(200, {'Content-Type': mimeTypes[ext] || 'text/plain'});
    res.end(data);
  });
}).listen(port);
