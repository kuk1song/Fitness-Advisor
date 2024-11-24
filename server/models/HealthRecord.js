import mongoose from 'mongoose';

const healthRecordSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  height: Number,
  weight: Number,
  age: Number,
  dietType: String,
  fitnessGoal: String,
  createdAt: { type: Date, default: Date.now },
});

const HealthRecord = mongoose.model('HealthRecord', healthRecordSchema);

export default HealthRecord;
