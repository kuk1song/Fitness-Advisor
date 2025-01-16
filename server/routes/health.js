import express from 'express';
import HealthRecord from '../models/HealthRecord.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticateToken, async (req, res) => {
    try {
        console.log('Health route accessed');
        console.log('User from token:', req.user);
        console.log('Request body:', req.body);

        // Ensure userId is obtained from the authenticated user
        if (!req.user || !req.user._id) {
            return res.status(400).json({
                success: false,
                message: 'User ID not found in token'
            });
        }

        // Create health record, including user ID
        const healthRecord = new HealthRecord({
            userId: req.user._id,        // Use the ID of the authenticated user
            userEmail: req.user.email,   // Use the email of the authenticated user
            userName: req.user.name,     // Use the name of the authenticated user
            weight: req.body.weight,
            height: req.body.height,
            age: req.body.age,
            dietType: req.body.dietType,
            activityLevel: req.body.activityLevel,
            fitnessExperience: req.body.fitnessExperience,
            mealFrequency: req.body.mealFrequency,
            sleepHours: req.body.sleepHours,
            goal: req.body.goal
        });

        console.log('Attempting to save health record:', healthRecord);

        const savedRecord = await healthRecord.save();
        console.log('Health record saved successfully:', savedRecord);

        res.status(201).json({
            success: true,
            message: 'Health data successfully submitted',
            data: savedRecord
        });

    } catch (error) {
        console.error('Error saving health data:', error);
        res.status(500).json({
            success: false,
            message: '(Backend: To MongoDB) Failed to submit health data',
            error: error.message
        });
    }
});

export default router;