const mongoose = require('mongoose');

const connectDB = async () => {
  const db = await mongoose.connect(process.env.DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  });
  console.log(`MongoDB is connected at ${db.connection.host}`.success);
};

module.exports = connectDB;
