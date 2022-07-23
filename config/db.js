require('dotenv').config();
const mongoose = require('mongoose');
function connectDB() {
    // Database connection 🥳
    mongoose.connect(process.env.MONGO_CONNECTION_URL);
    const connection = mongoose.connection;
    connection.on('error',(e)=>{
        console.log(e);
    })
    connection.once('open', () => {
        console.log('Database connected 🥳🥳🥳🥳');
    }); 
} 

// mIAY0a6u1ByJsWWZ

module.exports = connectDB;