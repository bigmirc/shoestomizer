
const express = require("express")
const router = express.Router()
const Sneaker = require('../models/sneaker')



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


//new sneaker route
router.get('/new', checkAuthenticated, (req,res) => {
    res.render('new.ejs', {name:req.user.name, sneaker: new Sneaker()})
})

//create sneaker route
router.post('/', async (req,res) => {
    const sneaker = new Sneaker({
        name: req.body.name,
        price: req.body.price,
        imageURL: req.body.imageURL

    })

    try {
        const newSneaker = await sneaker.save()
        console.log(sneaker)
        res.redirect('/')

    } catch {

        res.render('new.ejs', {name:req.user.name, sneaker: sneaker, errorMessage: 'Error creating sneaker'})

    }

    // sneaker.save((err, newSneaker) =>{
    //     if (err){
    //         res.render('new.ejs', {name:req.user.name, sneaker: sneaker, errorMessage: 'Error creating sneaker'})
    //     } else {
    //         console.log(sneaker)
    //         res.redirect('/')
    //     }
    // })
})

module.exports = router






