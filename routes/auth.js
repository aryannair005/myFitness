const express = require('express');
const User = require('../models/User');
const router = express.Router();

// Get login page
router.get('/login', (req, res) => {
  res.render('auth/login', { error: null });
});

// Get register page
router.get('/register', (req, res) => {
  res.render('auth/register', { error: null });
});

// Handle login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      return res.render('auth/login', { error: 'Invalid email or password' });
    }

    req.session.userId = user._id;
    req.session.username = user.username;
    res.redirect('/workouts');
  } catch (error) {
    res.render('auth/login', { error: 'Something went wrong' });
  }
});

// Handle registration
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });
    
    if (existingUser) {
      return res.render('auth/register', { 
        error: 'User with this email or username already exists' 
      });
    }

    const user = new User({ username, email, password });
    await user.save();

    req.session.userId = user._id;
    req.session.username = user.username;
    res.redirect('/workouts');
  } catch (error) {
    res.render('auth/register', { error: 'Something went wrong' });
  }
});

// Logout
router.post('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/auth/login');
});

module.exports = router;