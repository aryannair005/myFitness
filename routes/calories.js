const express = require('express');
const CalorieProfile = require('../models/CalorieProfile');
const router = express.Router();

// Middleware to check if user is logged in
const requireAuth = (req, res, next) => {
  if (!req.session.userId) {
    return res.redirect('/auth/login');
  }
  next();
};

router.use(requireAuth);

// Get calorie calculator page
router.get('/', async (req, res) => {
  try {
    const existingProfile = await CalorieProfile.findOne({ userId: req.session.userId });
    res.render('calories/calculator', { 
      title: 'Calorie Calculator - Fitness Tracker',
      username: req.session.username,
      profile: existingProfile 
    });
  } catch (error) {
    res.render('calories/calculator', { 
      title: 'Calorie Calculator - Fitness Tracker',
      username: req.session.username,
      profile: null,
      error: 'Could not load profile data' 
    });
  }
});

// Calculate and save calorie profile
router.post('/calculate', async (req, res) => {
  try {
    const { age, gender, height, weight, activityLevel } = req.body;
    
    // Validate input
    if (!age || !gender || !height || !weight || !activityLevel) {
      return res.render('calories/calculator', { 
        title: 'Calorie Calculator - Fitness Tracker',
        username: req.session.username,
        profile: null,
        error: 'Please fill in all fields' 
      });
    }

    // Calculate BMR using Mifflin-St Jeor equation
    let bmr;
    if (gender === 'male') {
      bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
    } else {
      bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
    }

    // Activity multipliers
    const activityMultipliers = {
      'sedentary': 1.2,        // Little or no exercise
      'lightly_active': 1.375, // Light exercise/sports 1-3 days/week
      'moderately_active': 1.55, // Moderate exercise/sports 3-5 days/week
      'very_active': 1.725,    // Hard exercise/sports 6-7 days a week
      'extra_active': 1.9      // Very hard exercise/sports & physical job
    };

    const maintenanceCalories = Math.round(bmr * activityMultipliers[activityLevel]);
    const deficitCalories = Math.round(maintenanceCalories - 500); // ~0.5kg/week loss
    const surplusCalories = Math.round(maintenanceCalories + 300); // Gradual muscle gain

    // Save or update profile
    const profileData = {
      userId: req.session.userId,
      age: parseInt(age),
      gender,
      height: parseFloat(height),
      weight: parseFloat(weight),
      activityLevel,
      bmr: Math.round(bmr),
      maintenanceCalories,
      deficitCalories,
      surplusCalories,
      lastCalculated: new Date()
    };

    await CalorieProfile.findOneAndUpdate(
      { userId: req.session.userId },
      profileData,
      { upsert: true, new: true }
    );

    res.render('calories/results', { 
      title: 'Your Calorie Results - Fitness Tracker',
      username: req.session.username,
      profile: profileData
    });

  } catch (error) {
    res.render('calories/calculator', { 
      title: 'Calorie Calculator - Fitness Tracker',
      username: req.session.username,
      profile: null,
      error: 'Calculation failed. Please try again.' 
    });
  }
});

// Get results page (for returning users)
router.get('/results', async (req, res) => {
  try {
    const profile = await CalorieProfile.findOne({ userId: req.session.userId });
    
    if (!profile) {
      return res.redirect('/calories');
    }

    res.render('calories/results', { 
      title: 'Your Calorie Results - Fitness Tracker',
      username: req.session.username,
      profile 
    });
  } catch (error) {
    res.redirect('/calories');
  }
});

// Update profile
router.post('/update', async (req, res) => {
  try {
    const { weight } = req.body;
    const profile = await CalorieProfile.findOne({ userId: req.session.userId });
    
    if (!profile) {
      return res.redirect('/calories');
    }

    // Recalculate with new weight
    let bmr;
    if (profile.gender === 'male') {
      bmr = (10 * weight) + (6.25 * profile.height) - (5 * profile.age) + 5;
    } else {
      bmr = (10 * weight) + (6.25 * profile.height) - (5 * profile.age) - 161;
    }

    const activityMultipliers = {
      'sedentary': 1.2,
      'lightly_active': 1.375,
      'moderately_active': 1.55,
      'very_active': 1.725,
      'extra_active': 1.9
    };

    const maintenanceCalories = Math.round(bmr * activityMultipliers[profile.activityLevel]);
    const deficitCalories = Math.round(maintenanceCalories - 500);
    const surplusCalories = Math.round(maintenanceCalories + 300);

    await CalorieProfile.findOneAndUpdate(
      { userId: req.session.userId },
      {
        weight: parseFloat(weight),
        bmr: Math.round(bmr),
        maintenanceCalories,
        deficitCalories,
        surplusCalories,
        lastCalculated: new Date()
      }
    );

    res.redirect('/calories/results');
  } catch (error) {
    res.redirect('/calories/results');
  }
});

module.exports = router;