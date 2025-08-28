const mongoose = require('mongoose');

const calorieProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
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
  height: {
    type: Number,
    required: true,
    min: 100, // cm
    max: 250
  },
  weight: {
    type: Number,
    required: true,
    min: 30, // kg
    max: 300
  },
  activityLevel: {
    type: String,
    required: true,
    enum: ['sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extra_active']
  },
  bmr: {
    type: Number,
    required: true
  },
  maintenanceCalories: {
    type: Number,
    required: true
  },
  deficitCalories: {
    type: Number,
    required: true
  },
  surplusCalories: {
    type: Number,
    required: true
  },
  lastCalculated: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});
calorieProfileSchema.index({ userId: 1 });

module.exports = mongoose.model('CalorieProfile', calorieProfileSchema);