const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const path = require('path');
const ejsMate = require('ejs-mate');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const workoutRoutes = require('./routes/workouts');
const calorieRoutes = require('./routes/calories');
const foodRoutes = require('./routes/food');
const plansRoutes = require('./routes/plans');
const testAlertRoutes = require('./routes/test-alert');

const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fitness-tracker')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('MongoDB connection error:', err));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Session setup
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));

// Make session user available in all EJS templates
app.use((req, res, next) => {
  res.locals.username = req.session.username || null;
  next();
});

// View engine setup with EJS Mate
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.use('/auth', authRoutes);
app.use('/workouts', workoutRoutes);
app.use('/calories', calorieRoutes);
app.use('/food', foodRoutes);
app.use('/plans', plansRoutes); // Add plans routes
app.use('/test', testAlertRoutes); // Test alert routes

app.get('/', (req, res) => {
  if (req.session.userId) {
    res.redirect('/plans');
  } else {
    res.render('landing', { title: 'FitTracker - Your Personal Workout Companion' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});