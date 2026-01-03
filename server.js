
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

// SPA Routing: Forward all non-file requests to index.html
app.get('*', (req, res) => {
  // If the request looks like a file (has an extension), don't send index.html
  if (req.path.includes('.')) {
    res.status(404).end();
    return;
  }
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Sovereign Server is running on port ${PORT}`);
});
