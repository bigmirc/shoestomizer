
const express = require("express")
const Sneaker = require('../models/sneaker')
const path = require('path');
const fs = require('fs')

class SneakersRepo {
    constructor(){
        this.sneakers = Sneaker.find({})
    }
    
    createSneaker(name, price, imageName){
        const sneaker = new Sneaker({
            name: name,
            price: price,
            imageName: imageName
        })
        return sneaker
    }

    findSneakerById(id){
        return Sneaker.findById(id)
    }

    //remove image if sneaker's not created properly
    removeSneakerImage(fileName){
        fs.unlink(path.join('./public/uploads/',fileName), err =>{
            if (err) console.log(err)
        })
    }

    editSneakerWithNewImage(sneaker, name, price, requestedFile, fileName){
        sneaker.name = name
        sneaker.price = price 
        sneaker.imageName = fileName
    }

    editSneakerWithoutNewImage(sneaker, name, price, requestedFile, fileName){
        sneaker.name = name
        sneaker.price = price 
    }

    saveSneaker(sneaker){
        sneaker.save()

    }
    removeSneaker(sneaker){
        sneaker.remove()
    }
}

module.exports = SneakersRepo