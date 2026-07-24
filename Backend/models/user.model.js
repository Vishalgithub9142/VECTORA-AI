const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },

    email: {
        type: String,
        required: [true, "Account already exist with this email "],
        unique: true
    },

    password: {
        type: String,
        required: true
    }


})

const userModel = mongoose.model('User', userSchema)

module.exports = userModel
 