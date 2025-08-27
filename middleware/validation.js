const Joi = require('joi');

// Custom error messages
const messages = {
  'string.empty': '{#label} is required',
  'string.email': 'Please enter a valid email address',
  'string.min': '{#label} must be at least {#limit} characters long',
  'any.required': '{#label} is required',
};

// Validation schemas
const authValidation = {
  // Login validation schema
  login: Joi.object({
    email: Joi.string().email().required().messages(messages),
    password: Joi.string().required().messages(messages)
  }),

  // Registration validation schema
  register: Joi.object({
    username: Joi.string().min(3).max(30).required().messages({
      ...messages,
      'string.min': 'Username must be at least 3 characters long',
      'string.max': 'Username cannot be longer than 30 characters'
    }),
    email: Joi.string().email().required().messages(messages),
    password: Joi.string().min(6).required().messages({
      ...messages,
      'string.min': 'Password must be at least 6 characters long'
    })
  })
};

// Middleware function to validate request body
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    
    if (error) {
      const errors = error.details.reduce((acc, curr) => {
        const key = curr.path[0];
        acc[key] = curr.message.replace(/\"/g, '');
        return acc;
      }, {});
      
      const errorMessage = Object.values(errors)[0];
      const templateData = {
        title: `${req.path.includes('login') ? 'Login' : 'Register'} - Fitness Tracker`,
        error: errorMessage,
        formData: req.body
      };
      console.log('Rendering template with data:', templateData);
      return res.status(400).render(`auth/${req.path.split('/').pop()}`, templateData);
    }
    
    next();
  };
};

module.exports = {
  authValidation,
  validate
};