const mongoose = require('mongoose')
const path = require('path')

const orderSchema = new mongoose.Schema({
    sneakerName: {
        type: String,
        required: true
    },   
    username: {
        type: String,
        required: true
    }, 
    price: {
        type: Number,
        required: true
    },
    size: {
        type: Number,
        required: true
    },  
    address: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    designName: {
        type: String,
        required: true
    }

}) 

orderSchema.virtual('imagePath').get( function(){
    if (this.designName != null){
        return path.join('/public/designUploads',this.designName)

    }
})

module.exports = new mongoose.model('Order', orderSchema)