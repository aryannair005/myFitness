const express = require('express');
const Workout = require('../models/Workout');
const workoutsController=require("../controllers/workoutsController.js");
const router = express.Router();

const {requireAuth} =require("../middleware/requireAuth.js");

router.use(requireAuth);

router.get('/', workoutsController.getWorkouts);
router.get('/create',workoutsController.createWorkouts);
router.post('/create', workoutsController.createNewWorkouts);
router.get('/:id', workoutsController.getWorkoutDetail);
router.post('/:id/start',workoutsController.startWorkout);
router.post('/:id/complete',workoutsController.completeWorkout);
router.post('/:id/delete', workoutsController.deleteWorkout);

module.exports = router;