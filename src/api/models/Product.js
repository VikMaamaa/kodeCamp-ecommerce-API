const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required: true,
        trim: true,
        max: 50
    },
    description:{
        type: String,
        default: 'No description',
        max: 300,
        trim: true
    },
    category:{
        type: String,
        required: true,
        max: 40,
        trim: true
    },
    price:{
        type: Number,
        required: true,
        trim: true,
    },
    dateCreated: {
        type: Date,
        default: Date.now,
    },
})

module.exports =  mongoose.model('Product', productSchema)