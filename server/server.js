import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import healthRoutes from './routes/health.js';
import userRoutes from './routes/user.js';
import authMiddleware from './middleware/auth.js';

dotenv.config();

// Create an Express instance
const app = express();

// Configure middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json());  // Parse JSON bodies

// MongoDB connection setup
mongoose.connect(`${process.env.MONGO_URI}`)
.then(() => console.log("Connected to DB"))
    .catch(console.error);

// Error handler middleware
const errorHandler = (err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: err.message });
};    

// Routes
app.use('/auth', authRoutes);
app.use('/health', authMiddleware, healthRoutes); // healthRoutes is the router object exported from health.js
app.use('/user', authMiddleware, userRoutes);

app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5000; // Use the PORT environment variable if it's defined, otherwise default to port 5000

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});