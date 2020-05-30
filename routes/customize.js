
const express = require("express")
const router = express.Router()
const Sneaker = require('../models/sneaker')




function checkAuthenticated(req, res, next){

    if (req.isAuthenticated()){
        return next();
    }

    res.redirect('/login');

}

//route for showing one sneaker by id
router.get('/customize/:id', checkAuthenticated, async (req,res) =>{

    try {
        const sneaker = await Sneaker.findById(req.params.id)
        res.render('customize.ejs', {name:req.user.name, sneaker: sneaker})

      } catch (error) {
        console.log(error)
        res.redirect('/index')
        
    }
})


module.exports = router






