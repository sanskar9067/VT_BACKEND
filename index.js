import express from 'express';
import connectDB from './utils/connectDB.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Create express app 
const app = express();

// Connect to database and start the server
connectDB();

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});