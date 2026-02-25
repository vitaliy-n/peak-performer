import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;
const DATA_DIR = path.join(__dirname, 'data');

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));

// Ensure data directory exists
try {
  await fs.mkdir(DATA_DIR, { recursive: true });
} catch (err) {
  console.error('Error creating data directory:', err);
}

// Login endpoint
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  
  if (username === 'admin' && password === 'admin') {
    res.json({ 
      success: true, 
      user: { 
        id: 'admin-user', 
        name: 'Admin', 
        role: 'admin',
        token: 'admin-token-123' 
      } 
    });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

// Save data endpoint
app.post('/api/data/:userId', async (req, res) => {
  const { userId } = req.params;
  const data = req.body;
  
  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    await fs.writeFile(
      path.join(DATA_DIR, `${userId}.json`), 
      JSON.stringify(data, null, 2)
    );
    res.json({ success: true });
  } catch (err) {
    console.error('Error saving data:', err);
    res.status(500).json({ error: 'Failed to save data' });
  }
});

// Load data endpoint
app.get('/api/data/:userId', async (req, res) => {
  const { userId } = req.params;
  
  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    const filePath = path.join(DATA_DIR, `${userId}.json`);
    const data = await fs.readFile(filePath, 'utf8');
    res.json(JSON.parse(data));
  } catch (err) {
    if (err.code === 'ENOENT') {
      // File not found, return null or empty object
      res.json(null);
    } else {
      console.error('Error loading data:', err);
      res.status(500).json({ error: 'Failed to load data' });
    }
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
