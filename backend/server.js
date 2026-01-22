const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const itemsRoutes = require('./routes/items');
const authRoutes = require('./routes/auth');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 4000;

// Trust proxy for Vercel deployment
app.set('trust proxy', 1);

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'https://nextjsapp-three-lime.vercel.app',
      process.env.CORS_ORIGIN,
    ].filter(Boolean),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'email', 'role'],
  })
);
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'SmartBazar Backend API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      items: '/api/items',
      auth: '/api/auth',
      testCors: '/test-cors',
      debugDb: '/debug/db',
    },
    timestamp: new Date().toISOString(),
  });
});

// Test CORS endpoint
app.get('/test-cors', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'CORS test successful',
    origin: req.headers.origin,
    userAgent: req.headers['user-agent'],
    timestamp: new Date().toISOString(),
  });
});

// Debug endpoint for MongoDB connection
app.get('/debug/db', async (req, res) => {
  try {
    const { getAllItems } = require('./data/itemsMongoDB');
    const items = await getAllItems();
    res.status(200).json({
      success: true,
      message: 'Database connection successful',
      itemCount: items.length,
      sampleItem: items[0] || null,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Database connection failed',
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// API Routes
app.use('/api/items', itemsRoutes);
app.use('/api/auth', authRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Environment: ${process.env.NODE_ENV}`);
  console.log(`🌐 CORS enabled for: ${process.env.CORS_ORIGIN}`);
  console.log(`📊 Health check: https://nextappbackend2.vercel.app/health`);
  console.log(`🗄️  MongoDB will connect on first request`);
});

module.exports = app;
