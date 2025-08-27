const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { authValidation, validate } = require('../middleware/validation');

// Get login page
router.get('/login', (req, res) => {
  res.render('auth/login', { 
    title: 'Login - Fitness Tracker',
    error: null 
  });
});

// Get register page
router.get('/register', (req, res) => {
  res.render('auth/register', { 
    title: 'Register - Fitness Tracker',
    error: null 
  });
});

// Handle login
router.post('/login', validate(authValidation.login), async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      const errorMsg = 'Invalid credentials';
      console.log('Login error:', errorMsg);
      return res.render('auth/login', { 
        title: 'Login - Fitness Tracker',
        error: errorMsg,
        formData: req.body
      });
    }

    req.session.userId = user._id;
    req.session.username = user.username; // store username in session
    res.redirect('/plans');
  } catch (error) {
    console.error('Login error:', error);
    const errorMsg = 'An error occurred while processing your login. Please try again.';
    res.render('auth/login', { 
      title: 'Login - Fitness Tracker',
      error: errorMsg,
      formData: req.body
    });
  }
});

// Handle registration
router.post('/register', validate(authValidation.register), async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });
    
    if (existingUser) {
      const errorMsg = 'User with this email or username already exists';
      return res.render('auth/register', { 
        title: 'Register - Fitness Tracker',
        error: errorMsg,
        formData: req.body
      });
    }

    const user = new User({ username, email, password });
    await user.save();

    req.session.userId = user._id;
    req.session.username = user.username; // store username in session
    res.redirect('/workouts');
  } catch (error) {
    console.error('Registration error:', error);
    const errorMsg = 'An error occurred while processing your registration. Please try again.';
    res.render('auth/register', { 
      title: 'Register - Fitness Tracker',
      error: errorMsg,
      formData: req.body
    });
  }
});

// Logout
router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/auth/login');
  });
});

module.exports = router;
