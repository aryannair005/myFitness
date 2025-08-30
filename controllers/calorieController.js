const CalorieProfile = require('../models/CalorieProfile');

// Activity levels for calorie calculation
const activityLevels = {
  sedentary: 1.2,        // Desk job, no exercise
  light: 1.375,          // Light exercise 1-3 days/week
  moderate: 1.55,        // Moderate exercise 3-5 days/week
  active: 1.725,         // Heavy exercise 6-7 days/week
  very_active: 1.9       // Very heavy exercise, physical job
};

// Calculate BMR and daily calories
function calculateCalories(age, gender, height, weight, activityLevel) {
  // Calculate BMR using Mifflin-St Jeor Equation
  let bmr;
  if (gender === 'male') {
    bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
  } else {
    bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
  }

  // Calculate daily calories based on activity
  const maintenance = Math.round(bmr * activityLevels[activityLevel]);
  const weightLoss = Math.round(maintenance - 500);  // 500 cal deficit
  const muscleGain = Math.round(maintenance + 300);  // 300 cal surplus

  return {
    bmr: Math.round(bmr),
    maintenance,
    weightLoss,
    muscleGain
  };
}

// Show calculator page
exports.getCalculator = async (req, res) => {
  try {
    const profile = await CalorieProfile.findOne({ userId: req.session.userId });
    
    res.render('calories/calculator', {
      title: 'Calorie Calculator',
      username: req.session.username,
      profile: profile
    });
  } catch (error) {
    console.error('Error loading calculator:', error);
    res.render('calories/calculator', {
      title: 'Calorie Calculator',
      username: req.session.username,
      profile: null,
      error: 'Could not load your previous data'
    });
  }
};

// Calculate and save profile
exports.calculateProfile = async (req, res) => {
  const { age, gender, height, weight, activityLevel } = req.body;
  
  // Check if all fields are filled
  if (!age || !gender || !height || !weight || !activityLevel) {
    return res.render('calories/calculator', {
      title: 'Calorie Calculator',
      username: req.session.username,
      profile: null,
      error: 'Please fill in all fields',
      formData: req.body
    });
  }

  try {
    // Calculate calories
    const calories = calculateCalories(age, gender, height, weight, activityLevel);

    // Create profile data
    const profileData = {
      userId: req.session.userId,
      age: parseInt(age),
      gender,
      height: parseFloat(height),
      weight: parseFloat(weight),
      activityLevel,
      bmr: calories.bmr,
      maintenance: calories.maintenance,
      weightLoss: calories.weightLoss,
      muscleGain: calories.muscleGain,
      lastCalculated: new Date()
    };

    // Save to database (create or update)
    await CalorieProfile.findOneAndUpdate(
      { userId: req.session.userId },
      profileData,
      { upsert: true, new: true }
    );

    // Show results
    res.render('calories/results', {
      title: 'Your Calorie Results',
      username: req.session.username,
      profile: profileData
    });
    
  } catch (error) {
    console.error('Error calculating calories:', error);
    res.render('calories/calculator', {
      title: 'Calorie Calculator',
      username: req.session.username,
      profile: null,
      error: 'Could not calculate calories. Please try again.',
      formData: req.body
    });
  }
};

// Show results page
exports.getResults = async (req, res) => {
  try {
    const profile = await CalorieProfile.findOne({ userId: req.session.userId });
    
    if (!profile) {
      return res.redirect('/calories');
    }

    res.render('calories/results', {
      title: 'Your Calorie Results',
      username: req.session.username,
      profile
    });
  } catch (error) {
    console.error('Error loading results:', error);
    res.redirect('/calories');
  }
};

// Update weight only
exports.updateWeight = async (req, res) => {
  const { weight } = req.body;
  
  try {
    const profile = await CalorieProfile.findOne({ userId: req.session.userId });
    
    if (!profile) {
      return res.redirect('/calories');
    }

    // Recalculate with new weight
    const calories = calculateCalories(
      profile.age, 
      profile.gender, 
      profile.height, 
      weight, 
      profile.activityLevel
    );

    // Update profile
    await CalorieProfile.findOneAndUpdate(
      { userId: req.session.userId },
      {
        weight: parseFloat(weight),
        bmr: calories.bmr,
        maintenance: calories.maintenance,
        weightLoss: calories.weightLoss,
        muscleGain: calories.muscleGain,
        lastCalculated: new Date()
      }
    );

    res.redirect('/calories/results');
  } catch (error) {
    console.error('Error updating weight:', error);
    res.redirect('/calories/results');
  }
};