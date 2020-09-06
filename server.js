const express = require('express');
const dotenv = require('dotenv');
const bootcamp = require('./routes/bootcamp');
const morgan = require('morgan');
const colors = require('colors');
const connectDB = require('./config/db');

const app = express();

//loading config variables
dotenv.config({
  path: './config/config.env',
});

//connectDB must be called underneath config variables
connectDB();

//dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('tiny'));
  colors.setTheme({
    success: 'rainbow',
    error: 'red',
  });
}

app.use('/api/v1/bootcamps', bootcamp);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () =>
  console.log(
    `server in ${process.env.NODE_ENV} mode running at port ${PORT}`.success
  )
);

//handling promise rejcetion
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error ${err.message}`.error);
  server.close(() => process.exit(1));
});
