
const express = require("express")
const router = express.Router()



function checkNotAuthenticated(req, res, next){
    if (req.isAuthenticated()){
        return res.redirect('/');
    }
    next();
}

router.get('/register', checkNotAuthenticated, (req,res) => {
    res.render('register.ejs')
})

module.exports = router






