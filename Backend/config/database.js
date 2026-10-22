require('dotenv').config()
const mongoose = require('mongoose');

async function connectDB() {
    if (!process.env.MONGODB_URI) {
        throw new Error('MONGODB_URI is required')
    }

    await mongoose.connect(process.env.MONGODB_URI)
    console.log('Database is connected successfully')
}

module.exports = connectDB