const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  instructions: [{
    type: String,
    required: true
  }],
  muscleGroups: [{
    type: String,
    required: true,
    enum: ['chest', 'back', 'shoulders', 'biceps', 'triceps', 'legs', 'quadriceps', 'hamstrings', 'glutes', 'calves', 'core', 'abs', 'cardio']
  }],
  equipment: {
    type: String,
    enum: ['bodyweight', 'dumbbells', 'barbell', 'machine', 'cable', 'resistance_band', 'kettlebell', 'medicine_ball'],
    default: 'bodyweight'
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  imageUrl: {
    type: String,
    default: null
  },
  videoUrl: {
    type: String,
    default: null
  },
  tips: [{
    type: String
  }],
  variations: [{
    name: String,
    description: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
exerciseSchema.index({ name: 1 });
exerciseSchema.index({ muscleGroups: 1 });
exerciseSchema.index({ equipment: 1 });
exerciseSchema.index({ difficulty: 1 });

module.exports = mongoose.model('Exercise', exerciseSchema);