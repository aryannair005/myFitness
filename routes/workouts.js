const express = require('express');
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

// Get all workouts
router.get('/', async (req, res) => {
  try {
    const workouts = await Workout.find({ userId: req.session.userId })
      .sort({ createdAt: -1 });
    res.render('workouts/index', { 
      title: 'My Workouts - Fitness Tracker',
      workouts, 
      username: req.session.username 
    });
  } catch (error) {
    res.render('workouts/index', { 
      title: 'My Workouts - Fitness Tracker',
      workouts: [], 
      username: req.session.username,
      error: 'Could not load workouts' 
    });
  }
});

// Get create workout page
router.get('/create', (req, res) => {
  res.render('workouts/create', { 
    title: 'Create Workout - Fitness Tracker',
    username: req.session.username 
  });
});

// Create new workout
router.post('/create', async (req, res) => {
  try {
    const { name, exercises } = req.body;
    
    const workout = new Workout({
      name,
      userId: req.session.userId,
      exercises: exercises || []
    });

    await workout.save();
    res.redirect('/workouts');
  } catch (error) {
    res.render('workouts/create', { 
      title: 'Create Workout - Fitness Tracker',
      username: req.session.username,
      error: 'Could not create workout' 
    });
  }
});

// Get workout details
router.get('/:id', async (req, res) => {
  try {
    const workout = await Workout.findOne({ 
      _id: req.params.id, 
      userId: req.session.userId 
    });
    
    if (!workout) {
      return res.redirect('/workouts');
    }

    res.render('workouts/detail', { 
      title: `${workout.name} - Fitness Tracker`,
      workout, 
      username: req.session.username 
    });
  } catch (error) {
    res.redirect('/workouts');
  }
});

// Start workout
router.post('/:id/start', async (req, res) => {
  try {
    const workout = await Workout.findOne({ 
      _id: req.params.id, 
      userId: req.session.userId 
    });
    
    if (!workout) {
      return res.redirect('/workouts');
    }

    res.render('workouts/active', { 
      title: `Active Workout: ${workout.name} - Fitness Tracker`,
      workout, 
      username: req.session.username 
    });
  } catch (error) {
    res.redirect('/workouts');
  }
});

// Complete workout
router.post('/:id/complete', async (req, res) => {
  try {
    const { totalTime } = req.body;
    
    await Workout.findOneAndUpdate(
      { _id: req.params.id, userId: req.session.userId },
      { 
        completed: true, 
        completedAt: new Date(),
        totalTime: totalTime || 0
      }
    );

    res.redirect('/workouts');
  } catch (error) {
    res.redirect('/workouts');
  }
});

// Delete workout
router.post('/:id/delete', async (req, res) => {
  try {
    await Workout.findOneAndDelete({ 
      _id: req.params.id, 
      userId: req.session.userId 
    });
    res.redirect('/workouts');
  } catch (error) {
    res.redirect('/workouts');
  }
});

module.exports = router;