import express from 'express';
import HealthRecord from '../models/HealthRecord.js';

const healthRoutes = express.Router();

healthRoutes.post('/', async (req, res) => { 

  console.log('Health route accessed');
  console.log('Request body:', req.body); 

  // Get the user's health data from the request of the client side. Client -> Server
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
    // Create a new health record in the database(MongoDB)
    const healthRecord = new HealthRecord({
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

    // Save the health record to the database
    await healthRecord.save();

    // Send a success response
    res.status(201).json({ message: 'Health data successfully submitted', data: healthRecord });
  } catch (error) {
    // Send an error response
    console.error('Error saving health data:', error);
    res.status(500).json({ message: 'Failed to submit health data', error: error.message });
  }
});

export default healthRoutes;