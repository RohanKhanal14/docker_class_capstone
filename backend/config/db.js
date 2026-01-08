const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://mongo:27017/taskmanager';
    // const mongoURI = 'mongodb+srv://Project-TaskF:Z3F3naGn6QKffWSj@taskforge.5jzq9wi.mongodb.net/?retryWrites=true&w=majority&appName=TaskForge';
    // const mongoURI = 'mongodb://admin:password@127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.5.3';
    
    await mongoose.connect(mongoURI);
    
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
