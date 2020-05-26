const mongoose = require('mongoose')
const path = require('path')

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

sneakerSchema.virtual('imagePath').get( function(){
    if (this.imageName != null){
        return path.join('/public/uploads',this.imageName)

    }
})

module.exports = new mongoose.model('Sneaker', sneakerSchema)