import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import healthRoutes from './routes/health.js';
import userRoutes from './routes/user.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection setup
mongoose.connect(`${process.env.MONGO_URI}`)
.then(() => console.log("Connected to DB"))
.catch(console.error);

// Routes
app.use('/auth', authRoutes);
app.use('/health', healthRoutes, userRoutes);

// Start Server
const PORT = process.env.PORT || 5000; // Use the PORT environment variable if it's defined, otherwise default to port 3000

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
    










// const mongoose = require('mongoose');

// // Schema
// const userSchema = new mongoose.Schema({
//   name: String,
//   email: String,
//   age: Number,
// });

// // Model
// const User = mongoose.model('User', userSchema);

// // Insert a new user
// const newUser = new User({
//   name: 'John Doe',
//   email: 'john@example.com',
//   age: 30,
// });

// newUser.save()
//   .then(() => console.log('User saved'))
//   .catch(err => console.error('Error saving user:', err));