import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import healthRoutes from './routes/health.js';
import { authenticateToken } from './middleware/auth.js';
import HealthRecord from './models/HealthRecord.js';
import HealthHistory from './models/HealthHistory.js';
import HealthVectorStore from './services/HealthVectorStore.js';

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
});

// MongoDB connection
const DB_NAME = 'test';
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    console.error('MongoDB URI is not defined in environment variables');
    process.exit(1);
}

// Ensure the connection string is correct
const CONNECTION_URL = MONGO_URI.startsWith('mongodb://') || MONGO_URI.startsWith('mongodb+srv://') 
    ? `${MONGO_URI}/${DB_NAME}`
    : `mongodb://${MONGO_URI}/${DB_NAME}`;

mongoose.connect(CONNECTION_URL)
    .then(() => {
        console.log('Connected to MongoDB');
        console.log('Database name:', mongoose.connection.name);
        console.log('Available collections:', Object.keys(mongoose.connection.collections));
        console.log('Registered models:', Object.keys(mongoose.models));
    })
    .catch((error) => {
        console.error('MongoDB connection error:', error);
    });

// Add connection event listener
mongoose.connection.on('collection', (collectionName) => {
    console.log('New collection created:', collectionName);
});

// Route registration - each route is registered once
app.use('/auth', authRoutes);
app.use('/api/health', healthRoutes);  

// 404 handling
app.use((req, res) => {
    console.log('404 - Route not found:', req.method, req.path);
    res.status(404).json({ 
        success: false, 
        message: `Route not found: ${req.method} ${req.path}` 
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log('Available routes:');
    console.log('- POST /auth/login');
    console.log('- POST /auth/register');
    console.log('- GET  /auth/user');
    console.log('- GET  /api/health');
    console.log('- POST /api/health');
});

// Add vector database initialization after MongoDB connection
console.log('Initializing Vector Database...');
try {
    await HealthVectorStore.initializeDB();
    console.log('Vector Database initialized successfully');
} catch (error) {
    console.error('Vector Database initialization error:', error);
}