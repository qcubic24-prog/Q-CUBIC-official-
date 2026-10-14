import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const contactHandler = require('./contact-api.cjs');
const studioHandler = require('./studio-api.cjs');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isProd = process.env.NODE_ENV === 'production';
const PORT = Number(process.env.PORT) || 3000;

async function createServer() {
  const app = express();

  // Helper for HTTP Range request streaming for video/audio
  const serveMediaWithRange = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const parsedUrl = new URL(req.url, 'http://localhost');
    const safePath = path.resolve(__dirname, '.' + decodeURIComponent(parsedUrl.pathname));
    if (!safePath.startsWith(__dirname)) return next();
    if (fs.existsSync(safePath) && fs.statSync(safePath).isFile()) {
      const ext = path.extname(safePath).toLowerCase();
      if (['.mp4', '.webp', '.webm', '.png', '.jpg', '.jpeg'].includes(ext)) {
        const stat = fs.statSync(safePath);
        const mimeTypes: Record<string, string> = {
          '.mp4': 'video/mp4',
          '.webm': 'video/webm',
          '.webp': 'image/webp',
          '.png': 'image/png',
          '.jpg': 'image/jpeg',
          '.jpeg': 'image/jpeg',
        };
        const contentType = mimeTypes[ext] || 'application/octet-stream';
        res.setHeader('Content-Type', contentType);
        res.setHeader('Accept-Ranges', 'bytes');
        res.setHeader('Cache-Control', 'public, max-age=3600');

        let start = 0;
        let end = stat.size - 1;
        const rangeHeader = req.headers.range;

        if (rangeHeader) {
          const match = /^bytes=(\d*)-(\d*)$/.exec(rangeHeader);
          if (match) {
            start = match[1] ? Number(match[1]) : Math.max(0, stat.size - Number(match[2]));
            end = match[1] && match[2] ? Math.min(Number(match[2]), end) : end;
            if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start > end || start >= stat.size) {
              res.writeHead(416, { 'Content-Range': `bytes */${stat.size}` });
              return res.end();
            }
            res.status(206);
            res.setHeader('Content-Range', `bytes ${start}-${end}/${stat.size}`);
          }
        }
        res.setHeader('Content-Length', end - start + 1);
        if (req.method === 'HEAD') return res.end();
        return fs.createReadStream(safePath, { start, end }).on('error', () => res.destroy()).pipe(res);
      }
    }
    next();
  };

  // API routes (Mounted before body parsers so handlers can consume raw streaming request)
  app.all('/api/contact', (req, res) => {
    return contactHandler(req, res);
  });

  app.all('/api/studio/*', (req, res) => {
    return studioHandler(req, res, __dirname);
  });

  // Media streaming handler for /src/assets and other video paths
  app.use('/src/assets', serveMediaWithRange);
  app.use('/src/contact', serveMediaWithRange);
  app.use('/src/studio/uploads', serveMediaWithRange);

  // Serve admin dashboard
  app.use('/admin', express.static(path.join(__dirname, 'admin')));

  // Work page
  app.get('/work', (_req, res) => {
    res.sendFile(path.join(__dirname, 'work.html'));
  });
  app.get('/work.html', (_req, res) => {
    res.sendFile(path.join(__dirname, 'work.html'));
  });

  // Company HTML pages
  app.get('/src/company/:page.html', (req, res, next) => {
    const file = path.join(__dirname, 'src', 'company', `${req.params.page}.html`);
    if (fs.existsSync(file)) {
      return res.sendFile(file);
    }
    next();
  });

  if (!isProd) {
    // Mount Vite in middleware mode
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
        watch: process.env.DISABLE_HMR === 'true' ? null : {},
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve dist or current dir
    app.use(express.static(__dirname));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Q-Cubic server running at http://0.0.0.0:${PORT}`);
  });
}

createServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
