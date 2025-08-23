const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  sets: {
    type: Number,
    default: 3
  },
  reps: {
    type: Number,
    default: 10
  },
  weight: {
    type: Number,
    default: 0
  },
  restTime: {
    type: Number,
    default: 60 // seconds
  }
});

const workoutSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  exercises: [exerciseSchema],
  totalTime: {
    type: Number,
    default: 0
  },
  completed: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date
  }
});

module.exports = mongoose.model('Workout', workoutSchema);
