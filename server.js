const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const connectDB = require('./config/db');
const bootcamp = require('./routes/bootcamp');
const errorHandler = require('./middlewares/error');

const app = express();
app.use(express.json());

//loading config variables
dotenv.config({ path: './config/config.env' });

//connectDB must be called underneath config variables
connectDB();

//dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('tiny'));
  colors.setTheme({ success: 'rainbow', error: 'red' });
}

app.use('/api/v1/bootcamps', bootcamp);
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
