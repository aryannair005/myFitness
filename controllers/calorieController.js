const CalorieProfile = require('../models/CalorieProfile');

//Activity multipliers
const activityMultipliers = {
  sedentary: 1.2,
  lightly_active: 1.375,
  moderately_active: 1.55,
  very_active: 1.725,
  extra_active: 1.9
};

//Helper function to calculate BMR & calories
const calculateCalories = (age, gender, height, weight, activityLevel) => {
  let bmr;
  if (gender === 'male') {
    bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
  } else {
    bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
  }

  const maintenanceCalories = Math.round(bmr * activityMultipliers[activityLevel]);
  const deficitCalories = Math.round(maintenanceCalories - 500);
  const surplusCalories = Math.round(maintenanceCalories + 300);

  return { bmr: Math.round(bmr), maintenanceCalories, deficitCalories, surplusCalories };
};

//Render calculator page
exports.getCalculator = async (req, res) => {
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
};

//Handle calculation + save profile
exports.calculateProfile = async (req, res) => {
  try {
    const { age, gender, height, weight, activityLevel } = req.body;

    if (!age || !gender || !height || !weight || !activityLevel) {
      return res.render('calories/calculator', {
        title: 'Calorie Calculator - Fitness Tracker',
        username: req.session.username,
        profile: null,
        error: 'Please fill in all fields'
      });
    }

    const { bmr, maintenanceCalories, deficitCalories, surplusCalories } =
      calculateCalories(age, gender, height, weight, activityLevel);

    const profileData = {
      userId: req.session.userId,
      age: parseInt(age),
      gender,
      height: parseFloat(height),
      weight: parseFloat(weight),
      activityLevel,
      bmr,
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
};

//Show results page
exports.getResults = async (req, res) => {
  try {
    const profile = await CalorieProfile.findOne({ userId: req.session.userId });
    if (!profile) return res.redirect('/calories');

    res.render('calories/results', {
      title: 'Your Calorie Results - Fitness Tracker',
      username: req.session.username,
      profile
    });
  } catch (error) {
    res.redirect('/calories');
  }
};

// Update profile weight
exports.updateProfile = async (req, res) => {
  try {
    const { weight } = req.body;
    const profile = await CalorieProfile.findOne({ userId: req.session.userId });

    if (!profile) return res.redirect('/calories');

    const { bmr, maintenanceCalories, deficitCalories, surplusCalories } =
      calculateCalories(profile.age, profile.gender, profile.height, weight, profile.activityLevel);

    await CalorieProfile.findOneAndUpdate(
      { userId: req.session.userId },
      {
        weight: parseFloat(weight),
        bmr,
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
};
