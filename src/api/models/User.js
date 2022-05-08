const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required: true,
        trim: true,
        max: 60
    },
    lastName:{
        type: String,
        required: true,
        trim: true,
        max: 60
    },
    email:{
        type:String,
        unique: true,
        required: true,
        index: true
    },
    password:{
        type:String,
        required: true,
        index: true
    }
}, { timestamps: true })

module.exports = mongoose.model('User', userSchema)