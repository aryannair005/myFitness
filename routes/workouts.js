const express = require('express');
const router = express.Router();
const workoutsController = require("../controllers/workoutsController.js");
const { requireAuth } = require("../middleware/requireAuth.js");

// All workout routes need login
router.use(requireAuth);

// Workout pages
router.get('/', workoutsController.getWorkouts);
router.get('/create', workoutsController.createWorkouts);
router.get('/:id', workoutsController.getWorkoutDetail);

// Workout actions
router.post('/create', workoutsController.createNewWorkouts);
router.post('/:id/start', workoutsController.startWorkout);
router.post('/:id/complete', workoutsController.completeWorkout);
router.post('/:id/delete', workoutsController.deleteWorkout);

module.exports = router;