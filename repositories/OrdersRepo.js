
const express = require("express")
const Order = require('../models/order')
const path = require('path');
const fs = require('fs')

class OrdersRepo {
    constructor(){
        this.orders = Order.find({})
    }

    createOrder(sneakerName, username, price, size, address, phoneNumber, designName){
        const order = new Order({
            sneakerName: sneakerName,
            username: username,
            price:price,
            size:size,
            address:address,
            phoneNumber:phoneNumber,
            designName: designName
        })

        return order

    }

    saveOrder(order){
        order.save()
    }

    
    //remove image if sneaker's not created properly
    removeOrderImage(fileName){
        fs.unlink(path.join('./public/uploads/',fileName), err =>{
            if (err) console.log(err)
        })
    }
}

module.exports = OrdersRepo