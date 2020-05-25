const mongoose = require('mongoose')

const sneakerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }, 
    price: {
        type: Number,
        required: true
    },
    imageName: {
        type: String,
        required: true
    }

}) 

module.exports = new mongoose.model('Sneaker', sneakerSchema)