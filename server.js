const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const path = require('path');
const fileupload = require('express-fileupload');
const cookiesParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const connectDB = require('./config/db');
const errorHandler = require('./middlewares/error');

//loading config variables
dotenv.config({ path: './config/config.env' });

//connectDB must be called underneath config variables
connectDB();

//route import
const bootcamp = require('./routes/bootcamp');
const courses = require('./routes/courses');
const auth = require('./routes/auth');
const user = require('./routes/user');
const review = require('./routes/reviews');

const app = express();

//cookie parser
app.use(cookiesParser());

//file upload
app.use(fileupload());

//specify static folder
app.use(express.static(path.join(__dirname, 'public')));

//body parser
app.use(express.json());

//mongo sanitizer
app.use(mongoSanitize());

//helmet: set security headers
app.use(helmet());

//prevent xss attacts
app.use(xss());

//dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('tiny'));
  colors.setTheme({ success: 'rainbow', error: 'red' });
}

app.use('/api/v1/bootcamps', bootcamp);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', user);
app.use('/api/v1/reviews', review);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () =>
  console.log(
    `server in ${process.env.NODE_ENV} mode running at port ${PORT}`.success
  )
);

//handling promise rejection
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error ${err.message}`.error);
  server.close(() => process.exit(1));
});
