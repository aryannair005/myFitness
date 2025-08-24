const express = require('express');
const FoodEntry = require('../models/FoodEntry');
const FatSecretService = require('../services/FatSecretService');
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

const fatSecretService = new FatSecretService();

// Get food diary for today
router.get('/', async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);

    const foodEntries = await FoodEntry.find({
      userId: req.session.userId,
      date: { $gte: startOfDay, $lt: endOfDay }
    }).sort({ createdAt: 1 });

    // Get user's calorie profile for targets
    const calorieProfile = await CalorieProfile.findOne({ userId: req.session.userId });

    // Calculate daily totals
    const dailyTotals = {
      calories: 0,
      carbs: 0,
      protein: 0,
      fat: 0,
      fiber: 0
    };

    const mealGroups = {
      breakfast: [],
      lunch: [],
      dinner: [],
      snack: []
    };

    foodEntries.forEach(entry => {
      dailyTotals.calories += entry.calories;
      dailyTotals.carbs += entry.carbs;
      dailyTotals.protein += entry.protein;
      dailyTotals.fat += entry.fat;
      dailyTotals.fiber += entry.fiber;

      mealGroups[entry.meal].push(entry);
    });

    res.render('food/diary', {
      title: 'Food Diary - Fitness Tracker',
      username: req.session.username,
      foodEntries: mealGroups,
      dailyTotals,
      calorieProfile,
      selectedDate: today.toISOString().split('T')[0]
    });
  } catch (error) {
    console.error('Error loading food diary:', error);
    res.render('food/diary', {
      title: 'Food Diary - Fitness Tracker',
      username: req.session.username,
      foodEntries: { breakfast: [], lunch: [], dinner: [], snack: [] },
      dailyTotals: { calories: 0, carbs: 0, protein: 0, fat: 0, fiber: 0 },
      calorieProfile: null,
      selectedDate: new Date().toISOString().split('T')[0],
      error: 'Could not load food diary'
    });
  }
});

// Get food diary for specific date
router.get('/date/:date', async (req, res) => {
  try {
    const selectedDate = new Date(req.params.date);
    const startOfDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
    const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);

    const foodEntries = await FoodEntry.find({
      userId: req.session.userId,
      date: { $gte: startOfDay, $lt: endOfDay }
    }).sort({ createdAt: 1 });

    const calorieProfile = await CalorieProfile.findOne({ userId: req.session.userId });

    const dailyTotals = {
      calories: 0,
      carbs: 0,
      protein: 0,
      fat: 0,
      fiber: 0
    };

    const mealGroups = {
      breakfast: [],
      lunch: [],
      dinner: [],
      snack: []
    };

    foodEntries.forEach(entry => {
      dailyTotals.calories += entry.calories;
      dailyTotals.carbs += entry.carbs;
      dailyTotals.protein += entry.protein;
      dailyTotals.fat += entry.fat;
      dailyTotals.fiber += entry.fiber;

      mealGroups[entry.meal].push(entry);
    });

    res.render('food/diary', {
      title: 'Food Diary - Fitness Tracker',
      username: req.session.username,
      foodEntries: mealGroups,
      dailyTotals,
      calorieProfile,
      selectedDate: req.params.date
    });
  } catch (error) {
    res.redirect('/food');
  }
});

// Add food page
router.get('/add/:meal', async (req, res) => {
  const validMeals = ['breakfast', 'lunch', 'dinner', 'snack'];
  if (!validMeals.includes(req.params.meal)) {
    return res.redirect('/food');
  }

  res.render('food/add', {
    title: `Add ${req.params.meal.charAt(0).toUpperCase() + req.params.meal.slice(1)} - Fitness Tracker`,
    username: req.session.username,
    meal: req.params.meal,
    selectedDate: req.query.date || new Date().toISOString().split('T')[0]
  });
});

// Search foods API endpoint
router.get('/api/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.length < 2) {
      return res.json({ foods: [] });
    }

    const foods = await fatSecretService.searchFoods(q, 10);
    res.json({ foods });
  } catch (error) {
    console.error('Food search error:', error);
    res.status(500).json({ error: 'Failed to search foods' });
  }
});

// Get food details API endpoint
router.get('/api/food/:id', async (req, res) => {
  try {
    const foodDetails = await fatSecretService.getFoodDetails(req.params.id);
    res.json(foodDetails);
  } catch (error) {
    console.error('Get food details error:', error);
    res.status(500).json({ error: 'Failed to get food details' });
  }
});

// Autocomplete API endpoint
router.get('/api/autocomplete', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.length < 2) {
      return res.json({ suggestions: [] });
    }

    const suggestions = await fatSecretService.getAutocompleteSuggestions(q);
    res.json({ suggestions });
  } catch (error) {
    console.error('Autocomplete error:', error);
    res.json({ suggestions: [] });
  }
});

// Add food entry
router.post('/add', async (req, res) => {
  try {
    const {
      meal,
      date,
      foodId,
      foodName,
      servingId,
      servingDescription,
      numberOfServings,
      calories,
      carbs,
      protein,
      fat,
      fiber,
      sugar,
      sodium
    } = req.body;

    const foodEntry = new FoodEntry({
      userId: req.session.userId,
      date: new Date(date),
      meal,
      foodId,
      foodName,
      servingId,
      servingDescription,
      numberOfServings: parseFloat(numberOfServings),
      calories: parseFloat(calories),
      carbs: parseFloat(carbs),
      protein: parseFloat(protein),
      fat: parseFloat(fat),
      fiber: parseFloat(fiber || 0),
      sugar: parseFloat(sugar || 0),
      sodium: parseFloat(sodium || 0)
    });

    await foodEntry.save();
    
    const redirectDate = date === new Date().toISOString().split('T')[0] ? '' : `/date/${date}`;
    res.redirect(`/food${redirectDate}`);
  } catch (error) {
    console.error('Error adding food entry:', error);
    res.redirect('/food');
  }
});

// Delete food entry
router.post('/delete/:id', async (req, res) => {
  try {
    await FoodEntry.findOneAndDelete({
      _id: req.params.id,
      userId: req.session.userId
    });

    res.redirect(req.get('Referer') || '/food');
  } catch (error) {
    console.error('Error deleting food entry:', error);
    res.redirect('/food');
  }
});

// Weekly summary
router.get('/weekly', async (req, res) => {
  try {
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - 6);
    weekStart.setHours(0, 0, 0, 0);

    const weekEnd = new Date(today);
    weekEnd.setHours(23, 59, 59, 999);

    const foodEntries = await FoodEntry.find({
      userId: req.session.userId,
      date: { $gte: weekStart, $lte: weekEnd }
    }).sort({ date: 1 });

    const calorieProfile = await CalorieProfile.findOne({ userId: req.session.userId });

    // Group by day
    const weeklyData = {};
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + i);
      const dayName = days[date.getDay()];
      const dateStr = date.toISOString().split('T')[0];
      
      weeklyData[dateStr] = {
        dayName,
        date: dateStr,
        calories: 0,
        carbs: 0,
        protein: 0,
        fat: 0
      };
    }

    foodEntries.forEach(entry => {
      const dateStr = entry.date.toISOString().split('T')[0];
      if (weeklyData[dateStr]) {
        weeklyData[dateStr].calories += entry.calories;
        weeklyData[dateStr].carbs += entry.carbs;
        weeklyData[dateStr].protein += entry.protein;
        weeklyData[dateStr].fat += entry.fat;
      }
    });

    res.render('food/weekly', {
      title: 'Weekly Summary - Fitness Tracker',
      username: req.session.username,
      weeklyData: Object.values(weeklyData),
      calorieProfile,
      weekStart: weekStart.toISOString().split('T')[0],
      weekEnd: weekEnd.toISOString().split('T')[0]
    });
  } catch (error) {
    console.error('Error loading weekly summary:', error);
    res.redirect('/food');
  }
});

module.exports = router;