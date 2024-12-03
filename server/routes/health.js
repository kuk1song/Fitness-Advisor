import express from 'express';
import HealthRecord from '../models/HealthRecord.js';
import authMiddleware from '../middleware/auth.js';

const healthRoutes = express.Router();

healthRoutes.post('/', async (req, res) => { // POST /health

  console.log('Health route accessed');
  console.log('Request body:', req); 
  const {
    weight,
    height,
    age,
    dietType,
    activityLevel,
    fitnessExperience,
    preferredExerciseTypes,
    mealFrequency,
    sleepHours,
    goal,
  } = req.body;

  try {
    // create a new health record
    const healthRecord = new HealthRecord({
      // userId: req.user.userId, // use the userId from the authenticated user
      weight,
      height,
      age,
      dietType,
      activityLevel,
      fitnessExperience,
      preferredExerciseTypes,
      mealFrequency,
      sleepHours,
      goal,
    });

    // save the health record to the database
    await healthRecord.save();

    // send a success response
    res.status(201).json({ message: 'Health data successfully submitted', data: healthRecord });
  } catch (error) {
    console.error('Error saving health data:', error);
    res.status(500).json({ message: 'Failed to submit health data', error: error.message });
  }
});

export default healthRoutes;