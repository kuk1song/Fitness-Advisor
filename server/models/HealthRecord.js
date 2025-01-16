import mongoose from 'mongoose';

const userHealthSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true, 
      ref: 'User', // related User Model
    },
    userEmail: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    weight: {
      type: String,
      required: true,
    },
    height: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    dietType: {
      type: String,
      enum: ['vegetarian', 'vegan', 'keto', 'other'],
      required: true,
    },
    activityLevel: {
      type: String,
      enum: ['sedentary', 'lightly active', 'moderately active', 'very active'],
      required: true,
    },
    fitnessExperience: {
      type: String,
      enum: ['never', 'beginner', 'intermediate', 'advanced'],
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
      required: false,
    },
  },
  {
    timestamps: true, 
  }
);

const HealthRecord = mongoose.model('UserHealth', userHealthSchema);

export default HealthRecord;
