const express = require('express');
const User = require('../models/User');
const { auth, validate, validateParams } = require('../validations');
const router = express.Router();

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
router.post('/login', 
  (req, res, next) => validate(auth.login)(req, res, next), 
  async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      return res.render('auth/login', { 
        title: 'Login - Fitness Tracker',
        errors: [{ message: 'Invalid email or password' }],
        formData: req.body
      });
    }

    req.session.userId = user._id;
    req.session.username = user.username; // store username in session
    res.redirect('/');
  } catch (error) {
    console.error('Login error:', error);
    res.render('auth/login', { 
      title: 'Login - Fitness Tracker',
      errors: [{ message: 'Something went wrong. Please try again.' }]
    });
  }
});

// Handle registration
router.post('/register', 
  (req, res, next) => validate(auth.register)(req, res, next), 
  async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.render('auth/register', {
        title: 'Register - Fitness Tracker',
        error: 'Email or username already in use',
        formData: req.body
      });
    }

    // Create new user
    const user = new User({ username, email, password });
    await user.save();

    // Log user in
    req.session.userId = user._id;
    req.session.username = user.username;
    res.redirect('/');
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).render('error', { error: 'Registration failed. Please try again.' });
  }
});

// Logout
router.post('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

// Handle password reset request
router.post('/forgot-password', 
  (req, res, next) => validate(auth.forgotPassword)(req, res, next), 
  async (req, res) => {
  try {
    // Implementation for password reset request
    res.json({ success: true, message: 'Password reset link sent to your email' });
  } catch (error) {
    console.error('Password reset request error:', error);
    res.status(500).json({ success: false, message: 'Failed to process password reset request' });
  }
});

// Handle password reset
router.post('/reset-password', 
  (req, res, next) => validate(auth.resetPassword)(req, res, next), 
  async (req, res) => {
  try {
    // Implementation for password reset
    res.json({ success: true, message: 'Password has been reset successfully' });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ success: false, message: 'Failed to reset password' });
  }
});

module.exports = router;
