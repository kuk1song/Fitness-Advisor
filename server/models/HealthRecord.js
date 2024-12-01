import mongoose from 'mongoose';

const userHealthSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true, 
      ref: 'User', // related User Model
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
    activityLevel: {
      type: String,
      enum: ['Sedentary', 'Lightly active', 'Moderately active', 'Very active'],
      required: true,
    },
    fitnessExperience: {
      type: String,
      enum: ['Never', 'Beginner', 'Intermediate', 'Advanced'],
      required: true,
    },
    preferredExerciseTypes: {
      type: [String],
      default: []
    },
    mealFrequency: {
      type: String,
      enum: ['2-3 meals', '3-5 meals', '6+ meals'],
      required: true
    },
    sleepHours: {
      type: Number,
      required: true,
    },
    goal: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, 
  }
);

const HealthRecord = mongoose.model('UserHealth', userHealthSchema);

export default HealthRecord;
