import mongoose from 'mongoose';

const userHealthSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true, 
      ref: 'User', // Related User Model
    },
    weight: {
      type: Number,
      required: true,
    },
    height: {
      type: Number,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    dietType: {
      type: String,
      enum: ['Vegetarian', 'Vegan', 'Keto', 'Other'],
      required: true,
    },
    goal: {
      type: String,
      required: true,
    },
    activityLevel: {
      type: String,
      enum: ['Sedentary', 'Lightly active', 'Moderately active', 'Very active'],
      required: true,
    },
    sleepHours: {
      type: Number,
      required: true,
    },
    waterIntake: {
      type: Number,
      required: true,
    },
    healthConditions: {
      type: [String], // Array of strings for multiple conditions
      default: [],
    },
    emotionalState: {
      type: String,
      enum: ['Good', 'Average', 'Poor'],
      required: true,
    },
    fitnessFrequency: {
      type: String,
      enum: ['Never', 'Occasionally', 'Regularly'],
      required: true,
    },
    dietaryHabits: {
      type: String,
      required: true,
    },
    bodyFatPercentage: {
      type: Number,
      required: false,
    },
    heartRate: {
      type: Number,
      required: false,
    },
    bloodPressure: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true, 
  }
);

const UserHealth = mongoose.model('UserHealth', userHealthSchema);

export default UserHealth;
