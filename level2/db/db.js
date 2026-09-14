const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log("DB Connect Successfully", conn.connection.name);
  } catch (error) {
    console.log("DB Connect Failed", conn.connection.error);
  }
};

module.exports = connectDB;
