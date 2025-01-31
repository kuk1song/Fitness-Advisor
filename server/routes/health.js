import express from 'express';
import HealthRecord from '../models/HealthRecord.js';
import HealthHistory from '../models/HealthHistory.js';
import { authenticateToken } from '../middleware/auth.js';
import mongoose from 'mongoose';
import HealthVectorStore from '../services/HealthVectorStore.js';

const router = express.Router();

// Get user health information
router.get('/', authenticateToken, async (req, res) => {
    try {
        const healthData = await HealthRecord.findOne({ userId: req.user.id });
        res.json({ success: true, data: healthData });
    } catch (error) {
        console.error('Error fetching health data:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Update or create user health information
router.post('/', authenticateToken, async (req, res) => {
    try {
        console.log('Received health data:', req.body);
        
        const existingHealth = await HealthRecord.findOne({ userId: req.user.id });
        
        // Get the latest version number of health history for the current user
        const latestHistory = await HealthHistory.findOne(
            { userId: req.user.id },
            { 'metadata.version': 1 }
        ).sort({ 'metadata.version': -1 });

        // Calculate the new version number
        const currentVersion = latestHistory ? 
            parseFloat(latestHistory.metadata.version) + 1 : 
            1.0;

        if (existingHealth) {
            // Create history record, including complete health data
            const historyRecord = new HealthHistory({
                userId: existingHealth.userId,
                userEmail: existingHealth.userEmail,
                userName: existingHealth.userName,
                healthData: {
                    weight: existingHealth.weight,
                    height: existingHealth.height,
                    age: existingHealth.age,
                    dietType: existingHealth.dietType,
                    activityLevel: existingHealth.activityLevel,
                    fitnessExperience: existingHealth.fitnessExperience,
                    mealFrequency: existingHealth.mealFrequency,
                    sleepHours: existingHealth.sleepHours,
                    goal: existingHealth.goal
                },
                metadata: {
                    recordType: 'update',
                    version: currentVersion.toFixed(1), 
                    tags: [],
                    lastUpdateTime: new Date()
                }
            });

            console.log('Saving history record version:', currentVersion);
            await historyRecord.save();

            // (In userhealths collection)Delete old record
            await HealthRecord.deleteOne({ userId: req.user.id });

            // (In userhealths collection)Create new record
            const newHealth = new HealthRecord({
                userId: req.user.id,
                userEmail: req.user.email,
                userName: req.user.name,
                ...req.body,
                updatedAt: new Date()
            });

            const savedHealth = await newHealth.save();
            console.log('Created updated health record:', savedHealth);

            // Store health data to vector database
            await HealthVectorStore.storeHealthData(req.user.id, req.body);

            // Find similar cases
            const similarProfiles = await HealthVectorStore.findSimilarProfiles(req.body);

            res.json({ 
                success: true, 
                data: savedHealth,
                version: currentVersion.toFixed(1),
                similarCases: similarProfiles
            });
        } else {
            // (In healthhistorys collection)Create new record
            const historyRecord = new HealthHistory({
                userId: req.user.id,
                userEmail: req.user.email,
                userName: req.user.name,
                healthData: req.body,
                metadata: {
                    recordType: 'initial',
                    version: '1.0',  // The first record version is 1.0
                    tags: [],
                    lastUpdateTime: new Date()
                }
            });

            await historyRecord.save();

            const newHealth = new HealthRecord({
                userId: req.user.id,
                userEmail: req.user.email,
                userName: req.user.name,
                ...req.body
            });
            const savedHealth = await newHealth.save();
            console.log('Created new health record:', savedHealth);

            // Store health data to vector database
            await HealthVectorStore.storeHealthData(req.user.id, req.body);

            // Find similar cases
            const similarProfiles = await HealthVectorStore.findSimilarProfiles(req.body);

            res.json({ 
                success: true, 
                data: savedHealth,
                version: '1.0',
                similarCases: similarProfiles
            });
        }
    } catch (error) {
        console.error('Detailed error:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({ 
            success: false, 
            message: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

// Get user health history
router.get('/history', authenticateToken, async (req, res) => {
    try {
        console.log('Attempting to fetch health history for user:', req.user.id);
        console.log('Available collections:', Object.keys(mongoose.connection.collections));

        const historyData = await HealthHistory.find({ 
            userId: req.user.id 
        }).sort({ recordDate: -1 });
        
        console.log('Retrieved health history:', historyData);
        res.json({ success: true, data: historyData });
    } catch (error) {
        console.error('Error fetching health history:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Add a new route to get user version history
router.get('/versions', authenticateToken, async (req, res) => {
    try {
        const versions = await HealthHistory.find(
            { userId: req.user.id },
            { 
                'metadata.version': 1,
                'metadata.recordType': 1,
                'metadata.lastUpdateTime': 1,
                recordDate: 1
            }
        ).sort({ 'metadata.version': -1 });

        res.json({
            success: true,
            data: versions
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Embedding vector database related routes 👇
// Get vector database statistics
router.get('/vector-stats', authenticateToken, async (req, res) => {
    try {
        const stats = await HealthVectorStore.getDBStats();
        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Get vector records of the current user
router.get('/vector-records', authenticateToken, async (req, res) => {
    try {
        const records = await HealthVectorStore.getUserHealthRecords(req.user.id);
        res.json({
            success: true,
            data: records
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Admin route: Get all vector records
router.get('/all-vector-records', authenticateToken, async (req, res) => {
    try {
        // Add admin check
        if (!req.user.isAdmin) {
            return res.status(403).json({
                success: false,
                message: 'Admin access required'
            });
        }

        const records = await HealthVectorStore.getAllHealthRecords();
        res.json({
            success: true,
            data: records
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

export default router;