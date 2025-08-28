const express = require('express');
const router = express.Router();
const calorieController = require('../controllers/calorieController');

// Middleware to check if user is logged in
const requireAuth = (req, res, next) => {
  if (!req.session.userId) {
    return res.redirect('/auth/login');
  }
  next();
};

router.use(requireAuth);

// Routes
router.get('/', calorieController.getCalculator);
router.post('/calculate', calorieController.calculateProfile);
router.get('/results', calorieController.getResults);
router.post('/update', calorieController.updateProfile);

module.exports = router;
