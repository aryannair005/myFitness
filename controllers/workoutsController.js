const express = require('express');
const Workout = require('../models/Workout');

module.exports.getWorkouts=async (req, res) => {
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
};


module.exports.createWorkouts= (req, res) => {
  res.render('workouts/create', { 
    title: 'Create Workout - Fitness Tracker',
    username: req.session.username,
    additionalJS: ['/js/workout-creator.js'] // Pass additionalJS from route
  });
}


module.exports.createNewWorkouts=async (req, res) => {
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
      additionalJS: ['/js/workout-creator.js'], // Pass additionalJS on error too
      error: 'Could not create workout' 
    });
  }
};

module.exports.getWorkoutDetail=async (req, res) => {
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
}

module.exports.startWorkout= async (req, res) => {
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
      username: req.session.username,
      additionalJS: ['/js/workout-timer.js'] // Pass additionalJS for timer
    });
  } catch (error) {
    res.redirect('/workouts');
  }
}


module.exports.completeWorkout= async (req, res) => {
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
};


module.exports.deleteWorkout=async (req, res) => {
  try {
    await Workout.findOneAndDelete({ 
      _id: req.params.id, 
      userId: req.session.userId 
    });
    res.redirect('/workouts');
  } catch (error) {
    res.redirect('/workouts');
  }
};