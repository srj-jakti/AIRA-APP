import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { adminAPIRouter, adminAPIManager } from './routes/adminAPI'
import { userAPIRouter } from './routes/userAPI'
import { strategyRouter } from './routes/strategy'
import { backtestRouter } from './routes/backtest'
import { scannerRouter } from './routes/scanner'
import { analysisRouter } from './routes/analysis'
import { tradingRouter } from './routes/trading'
import { notificationsRouter } from './routes/notifications'
import { aiStrategyRouter } from './routes/aiStrategy'
import { telegramRouter } from './routes/telegram'
import { whatsappRouter } from './routes/whatsapp'
import { razorpayRouter } from './routes/razorpay'
import { adminRouter } from './routes/admin'
import { supportRouter } from './routes/support'
import { healthRouter } from './routes/health'
import { backupRouter } from './routes/backup'
import { DataStreamingService } from './services/dataStreaming'
import { MarketScanner } from './services/marketScanner'
import { tradingEngine } from './services/tradingEngine'
import { aiStrategyScheduler } from './services/aiStrategyScheduler'
import { telegramBotService } from './services/telegramBot'
import { healthMonitor } from './services/healthMonitor'
import { backupService } from './services/backupService'
import { errorHandler, notFoundHandler } from './middleware/errorHandler'
import { logger } from './services/logger'

dotenv.config()

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
})

const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json())

// Request logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`, {
    ip: req.ip,
    userAgent: req.get('user-agent'),
  });
  next();
});

// API routes
app.use('/api/v1', healthRouter)
app.use('/api/v1', adminAPIRouter)
app.use('/api/v1', userAPIRouter)
app.use('/api/v1', strategyRouter)
app.use('/api/v1', backtestRouter)
app.use('/api/v1', scannerRouter)
app.use('/api/v1', analysisRouter)
app.use('/api/v1', tradingRouter)
app.use('/api/v1', notificationsRouter)
app.use('/api/v1', aiStrategyRouter)
app.use('/api/v1', telegramRouter)
app.use('/api/v1', whatsappRouter)
app.use('/api/v1', razorpayRouter)
app.use('/api/v1', adminRouter)
app.use('/api/v1', supportRouter)
app.use('/api/v1', backupRouter)

app.get('/api/v1/status', (req, res) => {
  res.json({ 
    message: 'AIRA Backend API',
    version: '1.0.0',
    environment: process.env.NODE_ENV
  })
})

// 404 handler - must be after all routes
app.use(notFoundHandler);

// Error handler - must be last
app.use(errorHandler);

// WebSocket connection handling
let dataStreamingService: DataStreamingService;
let marketScanner: MarketScanner;

// Initialize services after admin APIs are loaded
setTimeout(() => {
  dataStreamingService = new DataStreamingService(io, adminAPIManager);
  marketScanner = new MarketScanner(io);
  console.log('Data streaming service initialized');
  console.log('Market scanner initialized');
  console.log('Trading engine initialized');
  
  // Initialize AI Strategy Scheduler
  aiStrategyScheduler.initialize();
  aiStrategyScheduler.start();
  console.log('AI Strategy Scheduler initialized');
  
  // Initialize Telegram Bot
  telegramBotService.initialize();
  
  // Start Health Monitor
  healthMonitor.start();
  console.log('Health Monitor started');
  
  // Start Backup Service
  backupService.start();
  console.log('Backup Service started');
}, 2000);

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id)

  // Handle market data subscription
  socket.on('market:subscribe', async (tokens: number[]) => {
    if (dataStreamingService) {
      await dataStreamingService.subscribe(tokens);
      socket.emit('market:subscribed', { tokens });
    }
  });

  // Handle market data unsubscription
  socket.on('market:unsubscribe', async (tokens: number[]) => {
    if (dataStreamingService) {
      await dataStreamingService.unsubscribe(tokens);
      socket.emit('market:unsubscribed', { tokens });
    }
  });

  // Handle status request
  socket.on('market:status', () => {
    if (dataStreamingService) {
      const status = dataStreamingService.getStatus();
      socket.emit('market:status', status);
    }
  });

  // Handle scanner start
  socket.on('scanner:start', async () => {
    if (marketScanner) {
      await marketScanner.startScanning();
      socket.emit('scanner:started', { success: true });
    }
  });

  // Handle scanner stop
  socket.on('scanner:stop', () => {
    if (marketScanner) {
      marketScanner.stopScanning();
      socket.emit('scanner:stopped', { success: true });
    }
  });

  // Handle scanner status request
  socket.on('scanner:status', () => {
    if (marketScanner) {
      const status = marketScanner.getStatus();
      socket.emit('scanner:status', status);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id)
  })
})

// Start server
httpServer.listen(PORT, () => {
  console.log(`🚀 AIRA Backend running on port ${PORT}`)
  console.log(`Environment: ${process.env.NODE_ENV}`)
})

export { app, io }
