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
app.use('/health', healthRoutes); // Use healthRoutes instead of router
app.use('/user', userRoutes);

// Start Server
const PORT = process.env.PORT || 5000; // Use the PORT environment variable if it's defined, otherwise default to port 5000

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});