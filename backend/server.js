require('dotenv').config();
const express = require('express');
const cors = require('cors');
const redis = require('redis');
const connectDB = require('./config/db');
const tasksRouter = require('./routes/tasks');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Connect to Redis
let redisClient;
(async () => {
  try {
    redisClient = redis.createClient({
  socket: {
    host: process.env.REDIS_HOST || 'redis',
    port: 6379
  },
  password: process.env.REDIS_PASSWORD || 'redis123'
});
    
    await redisClient.connect();
    console.log('Redis connected successfully');
  } catch (error) {(async () => {
  try {
    redisClient = redis.createClient({
  socket: {
    host: process.env.REDIS_HOST || 'redis',
    port: 6379
  },
  password: process.env.REDIS_PASSWORD || 'redis123'
});
    
    await redisClient.connect();
    console.log('Redis connected successfully');
  } catch (error) {
    console.error('Redis connection error:', error);
  }
})();
    console.error('Redis connection error:', error);
  }
})();

// Health check endpoint
app.get('/health', async (req, res) => {
  const health = {
    status: 'UP',
    timestamp: new Date().toISOString(),
    services: {
      api: 'healthy',
      mongodb: 'unknown',
      redis: 'unknown'
    }
  };
  
  try {
    // Check MongoDB
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState === 1) {
      health.services.mongodb = 'healthy';
    } else {
      health.services.mongodb = 'unhealthy';
      health.status = 'DEGRADED';
    }
    
    // Check Redis
    if (redisClient && redisClient.isOpen) {
      await redisClient.ping();
      health.services.redis = 'healthy';
    } else {
      health.services.redis = 'unhealthy';
      health.status = 'DEGRADED';
    }
  } catch (error) {
    health.status = 'DOWN';
  }
  
  res.status(health.status === 'UP' ? 200 : 503).json(health);
});

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'Task Manager API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      tasks: '/api/tasks'
    }
  });
});

app.use('/api/tasks', tasksRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
