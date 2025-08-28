const mongoose = require('mongoose');

const workoutPlanExerciseSchema = new mongoose.Schema({
  exerciseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exercise',
    required: true
  },
  sets: {
    type: Number,
    required: true,
    min: 1
  },
  reps: {
    type: String,
    required: true
  },
  weight: {
    type: String,
    default: 'moderate'
  },
  restTime: {
    type: Number,
    default: 60
  },
  notes: {
    type: String
  }
});

const workoutPlanSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      'push_pull_legs', 
      'upper_lower', 
      'full_body', 
      'bro_split',
      'cardio',
      'strength',
      'hiit',
      'bodyweight'
    ]
  },
  targetMuscles: [{
    type: String,
    enum: ['chest', 'back', 'shoulders', 'biceps', 'triceps', 'legs', 'quadriceps', 'hamstrings', 'glutes', 'calves', 'core', 'abs', 'cardio']
  }],
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  equipment: {
    type: String,
    enum: ['gym', 'home', 'minimal', 'bodyweight'],
    required: true
  },
  exercises: [workoutPlanExerciseSchema],
  tags: [{
    type: String
  }],
  imageUrl: {
    type: String,
    default: null
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: String,
    default: 'FitTracker Team'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});


workoutPlanSchema.index({ category: 1, difficulty: 1 });
workoutPlanSchema.index({ targetMuscles: 1 });
workoutPlanSchema.index({ equipment: 1 });

module.exports = mongoose.model('WorkoutPlan', workoutPlanSchema);