// Simple validation functions
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  return password && password.length >= 6;
};

const validateUsername = (username) => {
  return username && username.length >= 3 && username.length <= 30;
};

// Login validation
const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  let error = null;

  if (!email) {
    error = 'Email is required';
  } else if (!validateEmail(email)) {
    error = 'Please enter a valid email';
  } else if (!password) {
    error = 'Password is required';
  }

  if (error) {
    return res.render('auth/login', {
      title: 'Login',
      error: error,
      email: email
    });
  }

  next();
};

// Register validation
const validateRegister = (req, res, next) => {
  const { username, email, password } = req.body;
  let error = null;

  if (!username) {
    error = 'Username is required';
  } else if (!validateUsername(username)) {
    error = 'Username must be 3-30 characters long';
  } else if (!email) {
    error = 'Email is required';
  } else if (!validateEmail(email)) {
    error = 'Please enter a valid email';
  } else if (!password) {
    error = 'Password is required';
  } else if (!validatePassword(password)) {
    error = 'Password must be at least 6 characters long';
  }

  if (error) {
    return res.render('auth/register', {
      title: 'Register',
      error: error,
      username: username,
      email: email
    });
  }

  next();
};

module.exports = {
  validateLogin,
  validateRegister
};