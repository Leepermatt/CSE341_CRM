require('dotenv').config();
const express = require('express');
const session = require("express-session");
const authMiddleware = require("./middleware/auth"); // Import the auth middleware
const passport = require("passport");
const homeRoute = require('./routes');
const mongodb = require('./db/connect'); // MongoDB native driver connection

require("./config/passport"); // Load Passport config

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

// Express session middleware
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

// Initialize Passport.js
app.use(passport.initialize());
app.use(passport.session());

const authRoute = require("./routes/auth"); // Import auth routes
app.use('/auth', authRoute); // Register authentication routes

// Apply the authMiddleware to the main page or any other routes to protect them
//app.use('/', authMiddleware, homeRoute);  // Protect homeRoute with authMiddleware

app.get('/auth/github/callback', 
  passport.authenticate('github', { failureRedirect: '/login' }),
  (req, res) => {
    // On successful authentication, redirect the user to the main page or any protected page
    res.redirect('/api-docs'); // Or your preferred page
  });

app.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).send('Error logging out');
    }
    res.redirect('/'); // Redirect to the home page or any other page after logout
  });
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
