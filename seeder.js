const dotenv = require('dotenv');
dotenv.config({ path: './config/config.env' });

const fs = require('fs');
const mongoose = require('mongoose');
const course = require('./models/Courses');
const bootcamp = require('./models/Bootcamps');
const user = require('./models/users');
const review = require('./models/Review');
const colors = require('colors');

colors.setTheme({ success: 'rainbow', error: 'red' });

mongoose.connect(process.env.DB, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const cData = JSON.parse(
  fs.readFileSync(`${__dirname}\\_data\\courses.json`, 'utf-8')
);

const bData = JSON.parse(
  fs.readFileSync(`${__dirname}\\_data\\bootcamps.json`, 'utf-8')
);

const uData = JSON.parse(
  fs.readFileSync(`${__dirname}\\_data\\users.json`, 'utf-8')
);

const rData = JSON.parse(
  fs.readFileSync(`${__dirname}\\_data\\reviews.json`, 'utf-8')
);

const importData = async () => {
  try {
    await bootcamp.create(bData);
    await course.create(cData);
    await user.create(uData);
    await review.create(rData);
    console.log('successful'.success);
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

const deleteData = async () => {
  try {
    await course.deleteMany();
    await bootcamp.deleteMany();
    await user.deleteMany();
    await review.deleteMany();
    console.log('database deleted successfully'.success);
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
}
