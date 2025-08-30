const mongoose = require('mongoose');

const calorieProfileSchema = new mongoose.Schema({
  // User reference
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  
  // Basic info
  age: {
    type: Number,
    required: true,
    min: 13,
    max: 120
  },
  gender: {
    type: String,
    required: true,
    enum: ['male', 'female']
  },
  
  // Physical measurements
  height: {
    type: Number,
    required: true,
    min: 100,  // cm
    max: 250
  },
  weight: {
    type: Number,
    required: true,
    min: 30,   // kg
    max: 300
  },
  
  // Activity level
  activityLevel: {
    type: String,
    required: true,
    enum: ['sedentary', 'light', 'moderate', 'active', 'very_active']
  },
  
  // Calculated calories
  bmr: {
    type: Number,
    required: true
  },
  maintenance: {
    type: Number,
    required: true
  },
  weightLoss: {
    type: Number,
    required: true
  },
  muscleGain: {
    type: Number,
    required: true
  },
  
  // Timestamps
  lastCalculated: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster user lookups
calorieProfileSchema.index({ userId: 1 });

module.exports = mongoose.model('CalorieProfile', calorieProfileSchema);