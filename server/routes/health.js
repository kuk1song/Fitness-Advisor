import express from 'express';
import HealthRecord from  '../models/HealthRecord.js';

const router = express.Router();

// receive POST request for user health data
router.post('/health', async (req, res) => {
  const {
    userId, // need to be passed in the request body
    weight,
    height,
    age,
    dietType,
    activityLevel,
    fitnessFrequency,
    preferredExerciseTypes,
    mealFrequency,
    sleepHours,
    goal,
  } = req.body;

  try {
    // create a new health record
    const healthRecord = new HealthRecord({
      userId,
      weight,
      height,
      age,
    dietType,
    activityLevel,
    fitnessFrequency,
    preferredExerciseTypes,
    mealFrequency,
    sleepHours,
    goal,
    });

    await healthRecord.save(); // save the health data to the database
    res.status(200).json({ message: 'Health data successfully uploaded!' });
  } catch (error) {
    console.error('Error uploading health data:', error);
    res.status(500).json({ message: 'Error uploading health data' });
  }
});

export default router;