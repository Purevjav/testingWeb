const mongoose = require('mongoose');

const connectDB = async() =>{
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB холбогдлоо : ${conn.connection.host}`.blue);
}
module.exports = connectDB;