const User = require('../models/User');

// Render login page
exports.getLogin = (req, res) => {
  res.render('auth/login', { 
    title: 'Login - Fitness Tracker',
    error: null 
  });
};

// Render register page
exports.getRegister = (req, res) => {
  res.render('auth/register', { 
    title: 'Register - Fitness Tracker',
    error: null 
  });
};

// Handle login
exports.postLogin = async (req, res) => {
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
    req.session.username = user.username;
    res.redirect('/plans');
  } catch (error) {
    console.error('Login error:', error);
    res.render('auth/login', { 
      title: 'Login - Fitness Tracker',
      error: 'An error occurred while processing your login. Please try again.',
      formData: req.body
    });
  }
};

// Handle registration
exports.postRegister = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });
    
    if (existingUser) {
      return res.render('auth/register', { 
        title: 'Register - Fitness Tracker',
        error: 'User with this email or username already exists',
        formData: req.body
      });
    }

    const user = new User({ username, email, password });
    await user.save();

    req.session.userId = user._id;
    req.session.username = user.username;
    res.redirect('/workouts');
  } catch (error) {
    console.error('Registration error:', error);
    res.render('auth/register', { 
      title: 'Register - Fitness Tracker',
      error: 'An error occurred while processing your registration. Please try again.',
      formData: req.body
    });
  }
};

// Handle logout
exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/auth/login');
  });
};
