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

// static method on course schema to get avg of course tuition
courseSchema.statics.getAverageCost = async function (bootcampId) {
  const obj = await this.aggregate([
    {
      $match: { bootcamp: bootcampId },
    },
    {
      $group: { _id: '$bootcamp', averageCost: { $avg: '$tuition' } },
    },
  ]);

  try {
    if (obj[0]) {
      await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
        averageCost: Math.ceil(obj[0].averageCost / 10) * 10,
      });
    } else {
      await this.model('Bootcamp').findByIdAndUpdate(bootcampid, {
        averageCost: undefined,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

//call average cost on bootcamp collection after save
courseSchema.post('save', async function () {
  await this.constructor.getAverageCost(this.bootcamp);
});

//call average cost on bootcamp collection before save
courseSchema.post('remove', async function () {
  await this.constructor.getAverageCost(this.bootcamp);
});

module.exports = mongoose.model('Course', courseSchema);
