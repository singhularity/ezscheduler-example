/**
 * Node.js backend for Scheduler Widget example
 * 
 * This server provides API endpoints to:
 * - List all saved schedules
 * - Get a specific schedule
 * - Save a schedule
 * - Delete a schedule
 */

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '../public')));

// In development mode, proxy requests to the React dev server
if (process.env.NODE_ENV === 'development') {
  app.use('/react', createProxyMiddleware({
    target: 'http://localhost:3001',
    changeOrigin: true,
  }));
}

// In production mode, serve the React build
app.use('/react', express.static(path.join(__dirname, '../../react-frontend/build')));

// Create data directory if it doesn't exist
const DATA_DIR = path.join(__dirname, '../data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// API Routes
// Get all schedules
app.get('/api/schedules', (req, res) => {
  try {
    const files = fs.readdirSync(DATA_DIR);
    const schedules = files
      .filter(file => file.endsWith('.json'))
      .map(file => {
        const id = file.replace('.json', '');
        const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
        return {
          id,
          name: data.scheduleName,
          timeZone: data.timeZone,
          eventCount: data.scheduleDetails.length
        };
      });
    
    res.json(schedules);
  } catch (error) {
    console.error('Error listing schedules:', error);
    res.status(500).json({ error: 'Failed to list schedules' });
  }
});

// Get a specific schedule
app.get('/api/schedules/:id', (req, res) => {
  try {
    const filePath = path.join(DATA_DIR, `${req.params.id}.json`);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Schedule not found' });
    }
    
    const scheduleData = fs.readFileSync(filePath, 'utf8');
    res.json(JSON.parse(scheduleData));
  } catch (error) {
    console.error('Error getting schedule:', error);
    res.status(500).json({ error: 'Failed to get schedule' });
  }
});

// Save a schedule
app.post('/api/schedules', (req, res) => {
  try {
    const schedule = req.body;
    
    if (!schedule || !schedule.scheduleName) {
      return res.status(400).json({ error: 'Invalid schedule data' });
    }
    
    // Generate a safe filename from the schedule name
    const id = schedule.scheduleName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_|_$/g, '');
    
    // Ensure all schedule details have IDs
    schedule.scheduleDetails = schedule.scheduleDetails.map(detail => {
      if (!detail.id) {
        detail.id = 'id_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now().toString(36);
      }
      return detail;
    });
    
    const filePath = path.join(DATA_DIR, `${id}.json`);
    fs.writeFileSync(filePath, JSON.stringify(schedule, null, 2));
    
    res.json({ 
      id, 
      message: 'Schedule saved successfully',
      name: schedule.scheduleName
    });
  } catch (error) {
    console.error('Error saving schedule:', error);
    res.status(500).json({ error: 'Failed to save schedule' });
  }
});

// Delete a schedule
app.delete('/api/schedules/:id', (req, res) => {
  try {
    const filePath = path.join(DATA_DIR, `${req.params.id}.json`);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Schedule not found' });
    }
    
    fs.unlinkSync(filePath);
    res.json({ message: 'Schedule deleted successfully' });
  } catch (error) {
    console.error('Error deleting schedule:', error);
    res.status(500).json({ error: 'Failed to delete schedule' });
  }
});

// Catch-all route for React frontend in production
app.get('/react/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../react-frontend/build/index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`- API available at http://localhost:${PORT}/api/schedules`);
  console.log(`- Node.js example at http://localhost:${PORT}`);
  console.log(`- React frontend at http://localhost:${PORT}/react`);
});
