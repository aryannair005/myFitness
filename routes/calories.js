const express = require('express');
const router = express.Router();
const calorieController = require('../controllers/calorieController');
const { requireAuth } = require("../middleware/requireAuth.js");

// All calorie routes need login
router.use(requireAuth);

// Calculator pages
router.get('/', calorieController.getCalculator);
router.get('/results', calorieController.getResults);

// Calculator actions
router.post('/calculate', calorieController.calculateProfile);
router.post('/update-weight', calorieController.updateWeight);

module.exports = router;