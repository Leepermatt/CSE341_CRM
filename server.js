require('dotenv').config();
const express = require('express');
const homeRoute = require('./routes');

const mongodb = require('./db/connect');


const app = express();
const PORT = process.env.PORT || 3000;


//app.use('/', homeRoute);
app.use(express.json());

//app.use(cors());

// Set CORS headers
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Mount routes
app.use('/', homeRoute);

process.on('unhandledRejection', (err, Origin) => {
  console.log(process.stderr.fd, 'Caught exception: ${err}\n' + 'Exception origin: ${Origin}');
  
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