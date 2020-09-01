const express = require('express');
const dotenv = require('dotenv');
const bootcamp = require('./routes/bootcamp');
const logger = require('./middlewares/logger');

const app = express();

//loading config variables
dotenv.config({
  path: './config/config.env',
});

app.use(logger);

app.use('/api/v1/bootcamps', bootcamp);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`server in ${process.env.NODE_ENV} mode running at port ${PORT}`)
);
