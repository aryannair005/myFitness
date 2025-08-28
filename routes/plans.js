const express = require('express');
const router = express.Router();
const {requireAuth}=require("../middleware/requireAuth.js");
const planController=require("../controllers/plansController.js");


router.use(requireAuth);

router.get('/',planController.getAllPlans);
router.get('/category/:category',planController.getWorkoutByCategories);
router.get('/:id', planController.planDetails);
router.get('/exercise/:id',planController.exerciseDetail);
router.post('/:id/copy', planController.getPlanWorkout);
router.get('/exercises/browse', planController.browseExercises);

module.exports = router;