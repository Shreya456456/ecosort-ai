const { spawn, exec } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

// Open URL in real default browser (bypasses VS Code Simple Browser)
function openBrowser(url) {
  const cmd = process.platform === 'win32'
            ? `rundll32 url.dll,FileProtocolHandler ${url}`
            : process.platform === 'darwin' ? `open "${url}"`
            : `xdg-open "${url}"`;
  exec(cmd, (err) => {
    if (err) console.log(`[Dev] Could not auto-open browser: ${err.message}`);
  });
}

// Kill any process already using the port, then start
function freePort(port, callback) {
  if (process.platform === 'win32') {
    exec(`netstat -ano | findstr :${port}`, (err, stdout) => {
      const lines = stdout ? stdout.trim().split('\n') : [];
      const pids = new Set();
      lines.forEach(line => {
        const parts = line.trim().split(/\s+/);
        const pid = parts[parts.length - 1];
        if (pid && /^\d+$/.test(pid) && pid !== '0') pids.add(pid);
      });
      if (pids.size === 0) return callback();
      const kills = [...pids].map(pid => new Promise(res => exec(`taskkill /PID ${pid} /F`, res)));
      Promise.all(kills).then(() => {
        console.log(`[Dev] Freed port ${port} (killed PID: ${[...pids].join(', ')})`);
        setTimeout(callback, 300); // small delay to ensure port is released
      });
    });
  } else {
    exec(`lsof -ti:${port}`, (err, stdout) => {
      const pid = stdout ? stdout.trim() : null;
      if (!pid) return callback();
      exec(`kill -9 ${pid}`, () => {
        console.log(`[Dev] Freed port ${port} (killed PID: ${pid})`);
        setTimeout(callback, 300);
      });
    });
  }
}

// Simple static file server
const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.json': 'application/json',
};

const server = http.createServer((req, res) => {
  const decodedUrl = decodeURIComponent(req.url);
  let filePath = path.join(__dirname, decodedUrl === '/' ? 'index.html' : decodedUrl);

  if (!filePath.startsWith(__dirname)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
      return;
    }
    fs.readFile(filePath, (readErr, data) => {
      if (readErr) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
      } else {
        const ext = path.extname(filePath).toLowerCase();
        res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
        res.end(data);
      }
    });
  });
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`[Dev] Port ${PORT} still in use. Please close the other process and try again.`);
  } else {
    console.error('[Dev] Server error:', err.message);
  }
  process.exit(1);
});

// Free the port first, then start everything
freePort(PORT, () => {
  const LOCAL_URL = `http://localhost:${PORT}`;

  console.log('\n================================================================');
  console.log(`🚀 EcoSort AI Frontend Server: ${LOCAL_URL}`);
  console.log('================================================================\n');

  // Auto-open in real system browser
  openBrowser(LOCAL_URL);

  server.listen(PORT, 'localhost', () => {
    // Start NEU-Bin local python model server
    console.log('[NEU-Bin] Starting Local Model Server (neubin_server.py)...\n');
    const pythonProcess = spawn('python', ['-u', 'neubin_server.py'], {
      cwd: __dirname,
      stdio: 'inherit',
      shell: false  // shell:false avoids the deprecation warning
    });

    pythonProcess.on('error', (err) => {
      console.error('[NEU-Bin Error] Failed to start Python server:', err.message);
      console.log('[NEU-Bin Info] Please ensure Python is installed and added to PATH.');
    });

    pythonProcess.on('exit', (code) => {
      console.log(`[NEU-Bin] Python server exited with code ${code}`);
      process.exit(code || 0);
    });

    const cleanUp = () => {
      console.log('\n[Dev] Gracefully shutting down servers...');
      pythonProcess.kill();
      server.close();
      process.exit(0);
    };

    process.on('SIGINT', cleanUp);
    process.on('SIGTERM', cleanUp);
    process.on('SIGHUP', cleanUp);
  });
});
