const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, 'please add course title'],
  },
  description: {
    type: String,
    required: [true, 'please add course description'],
  },
  weeks: {
    type: String,
    required: [true, 'please add number of weeks'],
  },
  tuition: {
    type: Number,
    required: [true, 'please add tuition cost'],
  },
  minimumSkill: {
    type: String,
    required: [true, 'please add minimum skill '],
    enum: ['beginner', 'intermediate', 'advanced'],
  },
  scholarship: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: 'Bootcamp',
    required: true,
  },
});

module.exports = mongoose.model('Course', courseSchema);
