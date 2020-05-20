
const express = require("express")
const router = express.Router()



function checkAuthenticated(req, res, next){

    if (req.isAuthenticated()){
        return next();
    }

    res.redirect('/login');

}

router.get('/customize', checkAuthenticated, (req,res) => {
    res.render('customize.ejs', {name:req.user.name})
})

module.exports = router






