const { MONGODB_URI } = require('./config');

const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
mongoose.set('debug', true);

console.log('connecting to', MONGODB_URI);

const connectToDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('connected to MongoDB');
  } catch (error) {
    console.log('error connecting to MongoDB:', error.message);
  }
};

module.exports = { connectToDatabase, mongoose };
