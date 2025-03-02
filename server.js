require('dotenv').config();
const express = require('express');

const homeRoute = require('./routes');
const mongodb = require('./db/connect');

// Initialize express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware: body parser and express json
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  next();
});

// Set CORS headers
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Mount routes
app.use('/', homeRoute);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, origin) => {
  console.log(`Caught exception: ${err}\nException origin: ${origin}`);
});

// Database Initialization and Server Start
mongodb.initDb((err, db) => {
  if (err) {
    console.error('Database connection failed:', err);
    process.exit(1); // Exit if the database connection fails
  } else {
    app.listen(PORT, () => {
      console.log(`Connected to DB and server is running on http://localhost:${PORT}`);
    });
  }
});
