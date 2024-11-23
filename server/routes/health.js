import express from 'express';
import HealthRecord from  '../models/HealthRecord.js';

const router = express.Router();

// store health record
router.post('/health', async (req, res) => {
  const { userId, height, weight, age, dietType, fitnessGoal } = req.body;

  const record = new HealthRecord({ userId, height, weight, age, dietType, fitnessGoal });
  await record.save();

  res.status(201).json({ message: 'Health record saved' });
});

export default router;