const express = require('express');
const dotenv = require('dotenv');
require('colors');
const connectDB = require('./config/db.js');
const router = require('./routes/branchRoutes.js');

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB database
connectDB();

// Create an instance of the Express application
const app = express();

// Mount the router on '/api' route
app.use("/api", router);

// Set the server port to listen on
const PORT = process.env.PORT || 3000;

// Start the server and log a message on successful start
app.listen(
  PORT,
  console.log(
    `Server running on port ${PORT}..`.yellow
      .bold
  )
);