const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
    const dbName = process.env.MONGODB_DB || 'duan1';
    const conn = await mongoose.connect(uri, { dbName });

    console.log(`Kết nối thành công`);
    console.log(`Database: ${conn.connection.name}`);
  } catch (error) {
    console.error(`Kết nối thất bại`);
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
