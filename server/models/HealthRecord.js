const mongoose = require('mongoose');

const UserHealthSchema = new mongoose.Schema({
  weight: { type: Number, required: true },
  height: { type: Number, required: true },
  age: { type: Number, required: true },
  dietType: { type: String, required: true },
  mealFrequency: { type: String, enum: ['2-3 meals', '3-5 meals', '6+ meals'], required: true },
  activityLevel: { type: String, enum: ['Sedentary', 'Lightly active', 'Moderately active', 'Very active'], required: true },
  fitnessExperience: { type: String, enum: ['Never', 'Beginner', 'Intermediate', 'Advanced'], required: true },
  preferredExerciseTypes: { type: [String], default: [] },
  sleepDuration: { type: Number, required: true },
  goal: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('UserHealth', UserHealthSchema);
