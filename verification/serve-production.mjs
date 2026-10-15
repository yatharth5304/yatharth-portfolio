// Local QA server: the production build with the actual Spring CSP. API responses
// use the checked-in verified snapshot; this is not a backend integration test.
import http from 'node:http';
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../frontend/dist/', import.meta.url));
const snapshot = JSON.parse(await readFile(new URL('../frontend/src/data/portfolio-snapshot.json', import.meta.url), 'utf8'));
const filter = await readFile(new URL('../src/main/java/com/jsp/portfolio/config/SecurityHeadersFilter.java', import.meta.url), 'utf8');
const csp = [...filter.slice(filter.indexOf('"default-src'), filter.indexOf('// Prevent MIME')).matchAll(/"([^"\n]*)"/g)].map(m => m[1]).join('');
const types = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.json':'application/json', '.svg':'image/svg+xml', '.png':'image/png', '.webp':'image/webp', '.glb':'model/gltf-binary', '.hdr':'application/octet-stream', '.ttf':'font/ttf', '.webm':'video/webm' };
http.createServer(async (req, res) => {
  res.setHeader('Content-Security-Policy', csp);
  const url = new URL(req.url, 'http://127.0.0.1');
  if (url.pathname.startsWith('/api/')) {
    const name = url.pathname.slice(5);
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(name === 'health' ? {status:'UP', database:'UP'} : snapshot[name] || [])); return;
  }
  const filename = path.resolve(root, '.' + (url.pathname === '/' || url.pathname === '/myworks' ? '/index.html' : decodeURIComponent(url.pathname)));
  if (!filename.startsWith(root)) { res.writeHead(403).end(); return; }
  try { res.setHeader('Content-Type', types[path.extname(filename)] || 'application/octet-stream'); res.end(await readFile(filename)); }
  catch { res.writeHead(404).end(); }
}).listen(4174, '127.0.0.1', () => console.log('Production CSP preview: http://127.0.0.1:4174/'));
