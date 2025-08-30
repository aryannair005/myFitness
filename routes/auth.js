const express = require('express');
const router = express.Router();
const { validateLogin, validateRegister } = require('../middleware/validation');
const authController = require('../controllers/authController');

// Show login and register pages
router.get('/login', authController.getLogin);
router.get('/register', authController.getRegister);

// Handle login and register forms
router.post('/login', validateLogin, authController.postLogin);
router.post('/register', validateRegister, authController.postRegister);

// Handle logout
router.post('/logout', authController.logout);

module.exports = router;