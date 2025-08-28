const express = require('express');
const router = express.Router();
const foodController = require('../controllers/foodController');
const { requireAuth } = require('../middleware/requireAuth');

router.use(requireAuth);

router.get('/', foodController.getFoodDairy);
router.get('/date/:date', foodController.getFoodDairyForSpecificDate);
router.get('/add/:meal', foodController.addFood);
router.get('/api/search', foodController.searchFoodWithApi);
router.get('/api/food/:id', foodController.getFoodDetails);
router.get('/api/autocomplete', foodController.autoComplete);
router.post('/add', foodController.addFoodEntry);
router.post('/delete/:id', foodController.deleteFoodEntry);
router.get('/weekly', foodController.weeklySummary);

module.exports = router;