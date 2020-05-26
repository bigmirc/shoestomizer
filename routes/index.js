
const express = require("express")
const router = express.Router()
const Sneaker = require('../models/sneaker')
const multer = require('multer');
const path = require('path');
const fs = require('fs')


function checkAuthenticated(req, res, next){

    if (req.isAuthenticated()){
        return next();
    }

    res.redirect('/login');

}

//all sneakers route
router.get('/', checkAuthenticated, async (req,res) => {
    try {
        const sneakers = await Sneaker.find({})
        res.render('index.ejs', {name:req.user.name, sneakers: sneakers})
    } catch  {
        res.redirect('/')
    }
})









module.exports = router