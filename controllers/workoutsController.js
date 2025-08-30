const Workout = require('../models/Workout');

// Show all workouts
exports.getWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.find({ userId: req.session.userId })
      .sort({ createdAt: -1 });
    
    res.render('workouts/index', { 
      title: 'My Workouts',
      workouts, 
      username: req.session.username 
    });
  } catch (error) {
    console.error('Error loading workouts:', error);
    res.render('workouts/index', { 
      title: 'My Workouts',
      workouts: [], 
      username: req.session.username,
      error: 'Could not load workouts' 
    });
  }
};

// Show create workout page
exports.createWorkouts = (req, res) => {
  res.render('workouts/create', { 
    title: 'Create Workout',
    username: req.session.username
  });
};

// Create new workout
exports.createNewWorkouts = async (req, res) => {
  const { name, exercises } = req.body;
  
  try {
    const workout = new Workout({
      name,
      userId: req.session.userId,
      exercises: exercises || []
    });

    await workout.save();
    res.redirect('/workouts');
    
  } catch (error) {
    console.error('Error creating workout:', error);
    res.render('workouts/create', { 
      title: 'Create Workout',
      username: req.session.username,
      error: 'Could not create workout',
      workoutName: name
    });
  }
};

// Show single workout details
exports.getWorkoutDetail = async (req, res) => {
  try {
    const workout = await Workout.findOne({ 
      _id: req.params.id, 
      userId: req.session.userId 
    });
    
    if (!workout) {
      return res.redirect('/workouts');
    }

    res.render('workouts/detail', { 
      title: workout.name,
      workout, 
      username: req.session.username 
    });
  } catch (error) {
    console.error('Error loading workout:', error);
    res.redirect('/workouts');
  }
};

// Start workout session
exports.startWorkout = async (req, res) => {
  try {
    const workout = await Workout.findOne({ 
      _id: req.params.id, 
      userId: req.session.userId 
    });
    
    if (!workout) {
      return res.redirect('/workouts');
    }

    res.render('workouts/active', { 
      title: `Active: ${workout.name}`,
      workout, 
      username: req.session.username
    });
  } catch (error) {
    console.error('Error starting workout:', error);
    res.redirect('/workouts');
  }
};

// Complete workout
exports.completeWorkout = async (req, res) => {
  const { totalTime } = req.body;
  
  try {
    await Workout.findOneAndUpdate(
      { _id: req.params.id, userId: req.session.userId },
      { 
        completed: true, 
        completedAt: new Date(),
        totalTime: parseInt(totalTime) || 0
      }
    );

    res.redirect('/workouts');
  } catch (error) {
    console.error('Error completing workout:', error);
    res.redirect('/workouts');
  }
};

// Delete workout
exports.deleteWorkout = async (req, res) => {
  try {
    await Workout.findOneAndDelete({ 
      _id: req.params.id, 
      userId: req.session.userId 
    });
    res.redirect('/workouts');
  } catch (error) {
    console.error('Error deleting workout:', error);
    res.redirect('/workouts');
  }
};