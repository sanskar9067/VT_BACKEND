import express from 'express';
import connectDB from './utils/connectDB.js';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import videoRoutes from './routes/video.routes.js';
import tweetRoutes from './routes/tweet.routes.js';

// Load environment variables
dotenv.config();

// Create express app 
const app = express();

//allow to send json and urlencoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static('uploads'));
app.use(cookieParser());

//allow to send files
app.use(express.static('uploads'));

// Connect to database and start the server
connectDB();

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/videos', videoRoutes);
app.use('/api/v1/tweets', tweetRoutes);

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});