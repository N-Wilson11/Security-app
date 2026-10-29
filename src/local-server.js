'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');
const { fetchAdvisories, FEED_URL } = require('./feed');

const PORT = Number(process.env.PORT) || 3005;
const REFRESH_MINUTES = Number(process.env.REFRESH_MINUTES) || 15;

const state = { advisories: [], updatedAt: null, error: null };

async function refresh() {
  try {
    state.advisories = await fetchAdvisories();
    state.updatedAt = new Date().toISOString();
    state.error = null;
  } catch (err) {
    state.error = err.message;
    console.error('Verversen mislukt:', err.message);
  }
}

const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const STATIC_FILES = {
  '/': ['index.html', 'text/html; charset=utf-8'],
  '/manifest.webmanifest': ['manifest.webmanifest', 'application/manifest+json; charset=utf-8'],
  '/icons/icon.svg': ['icons/icon.svg', 'image/svg+xml'],
  '/icons/icon-192.png': ['icons/icon-192.png', 'image/png'],
  '/icons/icon-512.png': ['icons/icon-512.png', 'image/png'],
  '/icons/apple-touch-icon.png': ['icons/apple-touch-icon.png', 'image/png'],
};

function createServer() {
  return http.createServer((req, res) => {
    const { pathname } = new URL(req.url, 'http://localhost');
    if (pathname === '/api/advisories') {
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ source: FEED_URL, refreshMinutes: REFRESH_MINUTES, ...state }));
    } else if (Object.hasOwn(STATIC_FILES, pathname)) {
      const [file, type] = STATIC_FILES[pathname];
      res.writeHead(200, { 'Content-Type': type });
      fs.createReadStream(path.join(PUBLIC_DIR, file)).pipe(res);
    } else {
      res.writeHead(404).end('Niet gevonden');
    }
  });
}

if (require.main === module) {
  refresh();
  setInterval(refresh, REFRESH_MINUTES * 60 * 1000).unref();
  createServer().listen(PORT, () => console.log(`Security app op http://localhost:${PORT}`));
}

module.exports = { createServer, refresh, state };
