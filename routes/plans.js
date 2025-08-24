const express = require('express');
const WorkoutPlan = require('../models/WorkoutPlan');
const Exercise = require('../models/Exercise');
const Workout = require('../models/Workout');
const router = express.Router();

// Middleware to check if user is logged in
const requireAuth = (req, res, next) => {
  if (!req.session.userId) {
    return res.redirect('/auth/login');
  }
  next();
};

router.use(requireAuth);

// Get all workout plans
router.get('/', async (req, res) => {
  try {
    const { category, difficulty, equipment } = req.query;
    let filter = { isPublic: true };
    
    if (category) filter.category = category;
    if (difficulty) filter.difficulty = difficulty;
    if (equipment) filter.equipment = equipment;

    const workoutPlans = await WorkoutPlan.find(filter)
      .sort({ createdAt: -1 })
      .limit(50);

    // Get unique categories for filter
    const categories = await WorkoutPlan.distinct('category', { isPublic: true });
    
    res.render('plans/index', {
      title: 'Workout Plans - Fitness Tracker',
      username: req.session.username,
      workoutPlans,
      categories,
      filters: { category, difficulty, equipment }
    });
  } catch (error) {
    console.error('Error loading workout plans:', error);
    res.render('plans/index', {
      title: 'Workout Plans - Fitness Tracker',
      username: req.session.username,
      workoutPlans: [],
      categories: [],
      filters: {},
      error: 'Could not load workout plans'
    });
  }
});

// Get workout plans by category
router.get('/category/:category', async (req, res) => {
  try {
    const category = req.params.category;
    const workoutPlans = await WorkoutPlan.find({ 
      category, 
      isPublic: true 
    }).sort({ difficulty: 1, createdAt: -1 });

    const categoryTitles = {
      'push_pull_legs': 'Push Pull Legs',
      'upper_lower': 'Upper Lower Split',
      'full_body': 'Full Body Workouts',
      'bro_split': 'Bro Split',
      'cardio': 'Cardio Workouts',
      'strength': 'Strength Training',
      'hiit': 'HIIT Workouts',
      'bodyweight': 'Bodyweight Workouts'
    };

    res.render('plans/category', {
      title: `${categoryTitles[category] || category} - Fitness Tracker`,
      username: req.session.username,
      workoutPlans,
      category,
      categoryTitle: categoryTitles[category] || category
    });
  } catch (error) {
    res.redirect('/plans');
  }
});

// Get workout plan details
router.get('/:id', async (req, res) => {
  try {
    const workoutPlan = await WorkoutPlan.findById(req.params.id)
      .populate('exercises.exerciseId');
    
    if (!workoutPlan) {
      return res.redirect('/plans');
    }

    res.render('plans/detail', {
      title: `${workoutPlan.name} - Fitness Tracker`,
      username: req.session.username,
      workoutPlan
    });
  } catch (error) {
    res.redirect('/plans');
  }
});

// Get exercise details
router.get('/exercise/:id', async (req, res) => {
  try {
    const exercise = await Exercise.findById(req.params.id);
    
    if (!exercise) {
      return res.status(404).json({ error: 'Exercise not found' });
    }

    res.render('plans/exercise-detail', {
      title: `${exercise.name} - Fitness Tracker`,
      username: req.session.username,
      exercise
    });
  } catch (error) {
    res.status(500).json({ error: 'Could not load exercise' });
  }
});

// Copy workout plan to user's workouts
router.post('/:id/copy', async (req, res) => {
  try {
    const workoutPlan = await WorkoutPlan.findById(req.params.id)
      .populate('exercises.exerciseId');
    
    if (!workoutPlan) {
      return res.redirect('/plans');
    }

    // Create new workout based on the plan
    const newWorkout = new Workout({
      name: workoutPlan.name,
      userId: req.session.userId,
      exercises: workoutPlan.exercises.map(ex => ({
        name: ex.exerciseId.name,
        sets: ex.sets,
        reps: typeof ex.reps === 'string' && ex.reps.includes('-') 
          ? parseInt(ex.reps.split('-')[1]) 
          : parseInt(ex.reps) || 10,
        weight: 0, // User will set their own weights
        restTime: ex.restTime || 60
      }))
    });

    await newWorkout.save();
    
    res.redirect(`/workouts/${newWorkout._id}`);
  } catch (error) {
    console.error('Error copying workout plan:', error);
    res.redirect(`/plans/${req.params.id}`);
  }
});

// Browse exercises
router.get('/exercises/browse', async (req, res) => {
  try {
    const { muscle, equipment, difficulty } = req.query;
    let filter = {};
    
    if (muscle) filter.muscleGroups = muscle;
    if (equipment) filter.equipment = equipment;
    if (difficulty) filter.difficulty = difficulty;

    const exercises = await Exercise.find(filter)
      .sort({ name: 1 })
      .limit(100);

    // Get unique values for filters
    const muscleGroups = await Exercise.distinct('muscleGroups');
    const equipmentTypes = await Exercise.distinct('equipment');
    
    res.render('plans/exercises', {
      title: 'Exercise Library - Fitness Tracker',
      username: req.session.username,
      exercises,
      muscleGroups: muscleGroups.sort(),
      equipmentTypes: equipmentTypes.sort(),
      filters: { muscle, equipment, difficulty }
    });
  } catch (error) {
    console.error('Error loading exercises:', error);
    res.render('plans/exercises', {
      title: 'Exercise Library - Fitness Tracker',
      username: req.session.username,
      exercises: [],
      muscleGroups: [],
      equipmentTypes: [],
      filters: {},
      error: 'Could not load exercises'
    });
  }
});

module.exports = router;