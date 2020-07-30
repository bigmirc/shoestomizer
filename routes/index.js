
const express = require("express")
const router = express.Router()
const Sneaker = require('../models/sneaker')

const SneakersRepo = require("../repositories/sneakersRepo");

const sneakersRepo = new SneakersRepo()



function checkAuthenticated(req, res, next){

    if (req.isAuthenticated()){
        return next();
    }

    res.redirect('/login');

}

//all sneakers route for index
router.get('/', checkAuthenticated, async (req,res) => {
    try {
        const sneakers = await sneakersRepo.sneakers
        res.render('index.ejs', {name:req.user.name, sneakers: sneakers})
    } catch  {
        res.redirect('/')
    }
})









module.exports = router