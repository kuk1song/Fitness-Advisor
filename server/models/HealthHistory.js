import mongoose from 'mongoose';

const healthHistorySchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        index: true
    },
    userEmail: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    healthData: {
        weight: String,
        height: String,
        age: Number,
        dietType: String,
        activityLevel: String,
        fitnessExperience: String,
        mealFrequency: String,
        sleepHours: Number,
        goal: String
    },
    metadata: {
        recordType: String,  // 'initial', 'update', etc.
        version: String,     // update times
        tags: [String]       
    },
    recordDate: {
        type: Date,
        default: Date.now,
        index: true
    }
}, { 
    collection: 'healthhistories',
    timestamps: true 
});

// Add compound index
healthHistorySchema.index({ userId: 1, recordDate: -1 });

// Add static method for retrieving user history
healthHistorySchema.statics.getUserHistory = async function(userId, options = {}) {
    const query = { userId };
    if (options.startDate) {
        query.recordDate = { $gte: options.startDate };
    }
    if (options.endDate) {
        query.recordDate = { ...query.recordDate, $lte: options.endDate };
    }
    
    return this.find(query)
        .sort({ recordDate: -1 })
        .limit(options.limit || 10);
};

// Add method for data vectorization (for future RAG)
healthHistorySchema.methods.toVector = function() {
    // Convert health data to vector format
    const healthData = this.healthData;
    return {
        userId: this.userId,
        timestamp: this.recordDate,
        dataVector: [
            parseFloat(healthData.weight),
            parseFloat(healthData.height),
            healthData.age,
            // ... other numeric data
        ],
        categories: [
            healthData.dietType,
            healthData.activityLevel,
            healthData.fitnessExperience,
            // ... other categorical data
        ]
    };
};

const HealthHistory = mongoose.models.HealthHistory || mongoose.model('HealthHistory', healthHistorySchema, 'healthhistories');

export default HealthHistory;