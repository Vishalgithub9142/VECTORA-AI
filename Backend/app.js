const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const logger = require('./logger');

const app = express();
app.set('trust proxy', 1);

// Middleware
app.use(helmet());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
}));
app.use(express.json({ limit: '32kb' }));
app.use(cookieParser());

app.get('/health', (req, res) => {
  const databaseReady = mongoose.connection.readyState === 1;
  res.status(databaseReady ? 200 : 503).json({ status: databaseReady ? 'ok' : 'unavailable' });
});

// CORS configuration – environment aware
const allowedOrigins = [
  ...(process.env.NODE_ENV === 'production' ? [] : [/^http:\/\/localhost(:\d+)?$/]),
  'https://vectora-ai-five.vercel.app',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.some(o => typeof o === 'string' ? o === origin : o.test(origin))) {
      callback(null, true);
    } else {
      callback(Object.assign(new Error('Not allowed by CORS'), { status: 403 }));
    }
  },
  credentials: true,
}));

// Routes
const authRouter = require('./routes/auth.routes');
const interviewRouter = require('./routes/interview.routes');
app.use('/api/auth', authRouter);
app.use('/api/interview', interviewRouter);

// Global error handler (fallback)
app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);
  logger.error(`${err.message} - ${req.method} ${req.originalUrl}`);
  const status = err.code === 'LIMIT_FILE_SIZE' || err.code === 'LIMIT_FIELD_VALUE' ? 413 :
    err.code?.startsWith('LIMIT_') ? 400 :
    Number.isInteger(err.status) ? err.status : 500;
  res.status(status).json({ message: status >= 500 ? 'Internal Server Error' : err.message });
});

module.exports = app;
