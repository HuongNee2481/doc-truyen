// Xem thử web trên máy: node scripts/build.js && node scripts/serve.js → http://localhost:5179
const http = require('http');
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '..', '_site');
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json' };

http.createServer((req, res) => {
  const url = decodeURIComponent(req.url.split('?')[0]);
  const file = path.join(OUT, url.endsWith('/') ? url + 'index.html' : url);
  if (!file.startsWith(OUT)) { res.writeHead(403); return res.end(); }
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404); return res.end('Không có ' + url); }
    res.writeHead(200, { 'Content-Type': (TYPES[path.extname(file)] || 'application/octet-stream') + '; charset=utf-8' });
    res.end(data);
  });
}).listen(5179, () => console.log('http://localhost:5179'));
