require('dotenv').config()
const mongoose = require('mongoose');

async function connectDB() {

    try {
        await mongoose.connect(process.env.MONGODB_URI)
        
        console.log("Database is connected successfully")
        
    } catch (error) {
        console.log("Database connection failed", error)
    }
}

module.exports = connectDB