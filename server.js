
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

// Serve static files from the root and dist
app.use(express.static(path.join(__dirname, 'dist')));
app.use(express.static(__dirname));

// Health Check
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// System Status API
app.get('/api/status', (req, res) => {
  const uptimeInSeconds = process.uptime();
  const status = {
    status: 'Operational',
    uptime: `${Math.floor(uptimeInSeconds)} seconds`,
    timestamp: new Date().toISOString()
  };
  res.status(200).json(status);
});

// SPA Routing: Forward all non-file requests to index.html
// Enhanced to decode URI components for Arabic paths
app.get('*', (req, res) => {
  const decodedPath = decodeURIComponent(req.path);
  
  // If the request looks like a file (has an extension), don't send index.html
  if (decodedPath.includes('.')) {
    res.status(404).end();
    return;
  }
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Sovereign Server is running on port ${PORT}`);
});
