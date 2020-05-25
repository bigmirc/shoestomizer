
const express = require("express")
const router = express.Router()
const Sneaker = require('../models/sneaker')
const multer = require('multer');
const path = require('path');

// Set The Storage Engine
const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: function(req, file, cb){
    cb(null,'sneaker' + Date.now() + path.extname(file.originalname));
  }
});

// Init Upload
const upload = multer({
  storage: storage,
  limits:{fileSize: 1000000},
  fileFilter: function(req, file, cb){
    checkFileType(file, cb);
  }
})

// Check File Type
function checkFileType(file, cb){
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if(mimetype && extname){
    return cb(null,true);
  } else {
    cb('Error: Images Only!');
  }
}



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
router.post('/', upload.single("myImage"), async (req,res) => {

    //console.log(req.file)

    const sneaker = new Sneaker({
        name: req.body.name,
        price: req.body.price,
        imageName: req.file.filename

    })

    try {
        const newSneaker = await sneaker.save()
        console.log(sneaker)
        res.redirect('/')

    } catch {

        res.render('new.ejs', {name:req.user.name, sneaker: sneaker, errorMessage: 'Error creating sneaker'})

    }
})

module.exports = router






