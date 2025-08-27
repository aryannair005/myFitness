const express = require('express');
const router = express.Router();

// Test alert route
router.get('/test-alert', (req, res) => {
  res.render('test-alert', {
    title: 'Test Alert',
    error: 'This is a test error message',
    errorMessage: 'This is a test error message',
    success: 'This is a success message',
    info: 'This is an info message'
  });
});

module.exports = router;
