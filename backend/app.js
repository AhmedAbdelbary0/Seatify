const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { AppError } = require('./utils/errorHandler');

const app = express();
// Middleware

app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);
app.use(express.json()); // Parse JSON requests

// Body parser

app.use(express.json({ limit: '10kb' }));
// Cookie parser
app.use(cookieParser());
// Routes

app.use('/api/v1/auth', require('./routes/authRoutes'));
app.use('/api/v1/events', require('./routes/eventRoutes'));

// Handle unknown routes and forward to global error handler
app.use((req, res, next) => {
  next(
    new AppError(`Can't find the route ${req.originalUrl} on this server!`, 404)
  );
});

// global error handler
const { errorHandler } = require('./utils/errorHandler');
app.use(errorHandler);

module.exports = app;
