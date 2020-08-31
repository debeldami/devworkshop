const express = require('express');
const dotenv = require('dotenv');

const app = express({});

//loading config variables
dotenv.config({
  path: './config/config.env',
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`server in ${process.env.NODE_ENV} mode running at port ${PORT}`)
);
