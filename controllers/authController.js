const User = require('../models/User');

// Show login page
exports.getLogin = (req, res) => {
  res.render('auth/login', { 
    title: 'Login',
    error: null 
  });
};

// Show register page
exports.getRegister = (req, res) => {
  res.render('auth/register', { 
    title: 'Register',
    error: null 
  });
};

// Login user
exports.postLogin = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      return res.render('auth/login', { 
        title: 'Login',
        error: 'Wrong email or password',
        email: email
      });
    }

    req.session.userId = user._id;
    req.session.username = user.username;
    
    res.redirect('/plans');
    
  } catch (error) {
    console.error('Login failed:', error);
    res.render('auth/login', { 
      title: 'Login',
      error: 'Something went wrong. Please try again.',
      email: email
    });
  }
};

// Register new user
exports.postRegister = async (req, res) => {
  const { username, email, password } = req.body;
  
  try {
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });
    
    if (existingUser) {
      return res.render('auth/register', { 
        title: 'Register',
        error: 'Email or username already taken',
        username: username,
        email: email
      });
    }

    // Create new user
    const user = new User({ username, email, password });
    await user.save();

    req.session.userId = user._id;
    req.session.username = user.username;
    res.redirect('/workouts');
    
  } catch (error) {
    console.error('Registration failed:', error);
    res.render('auth/register', { 
      title: 'Register',
      error: 'Registration failed. Please try again.',
      username: username,
      email: email
    });
  }
};

// Logout user
exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/auth/login');
  });
};