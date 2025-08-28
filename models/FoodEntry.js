const mongoose = require('mongoose');

const foodEntrySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  meal: {
    type: String,
    required: true,
    enum: ['breakfast', 'lunch', 'dinner', 'snack']
  },
  foodId: {
    type: String,
    required: true 
  },
  foodName: {
    type: String,
    required: true
  },
  servingId: {
    type: String,
    required: true 
  },
  servingDescription: {
    type: String,
    required: true
  },
  numberOfServings: {
    type: Number,
    required: true,
    default: 1,
    min: 0.1
  },
  calories: {
    type: Number,
    required: true
  },
  carbs: {
    type: Number,
    required: true
  },
  protein: {
    type: Number,
    required: true
  },
  fat: {
    type: Number,
    required: true
  },
  fiber: {
    type: Number,
    default: 0
  },
  sugar: {
    type: Number,
    default: 0
  },
  sodium: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});


foodEntrySchema.index({ userId: 1, date: 1 });
foodEntrySchema.index({ userId: 1, date: 1, meal: 1 });


foodEntrySchema.statics.getDateOnly = function(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

module.exports = mongoose.model('FoodEntry', foodEntrySchema);
