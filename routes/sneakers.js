
const express = require("express")
const router = express.Router()
const Sneaker = require('../models/sneaker')
const multer = require('multer');
const path = require('path');
const fs = require('fs')

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
  limits:{fileSize: 10000000},
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
router.get('/sneakers', checkAuthenticated, async (req,res) => {
    try {
        const sneakers = await Sneaker.find({})
        res.render('sneakers.ejs', {name:req.user.name, sneakers: sneakers})
    } catch  {
        res.redirect('/')
    }
})

//new sneaker route
router.get('/new', checkAuthenticated, (req,res) => {
    res.render('new.ejs', {name:req.user.name, sneaker: new Sneaker()})
})

//remove image if sneaker's not created properly
function removeSneakerImage(fileName){
  fs.unlink(path.join('./public/uploads/',fileName), err =>{
    if (err) console.log(err)
  })

}
//create sneaker route
router.post('/sneakers', upload.single("myImage"), async (req,res) => {

  if (req.file == null){
    fileName = ''
  } else {
    fileName = req.file.filename
  }

  const sneaker = new Sneaker({
      name: req.body.name,
      price: req.body.price,
      imageName: fileName

  })

  try {
    const newSneaker = await sneaker.save()
    console.log(sneaker)
    res.redirect('/sneakers')

  } catch {

    if (sneaker.imageName != ''){removeSneakerImage(sneaker.imageName)}
    res.render('new.ejs', {name:req.user.name, sneaker: sneaker, errorMessage: 'Error creating sneaker'})

  }
})

//route for showing one sneaker by id
router.get('/sneakers/:id',  (req,res) =>{
  res.send('show sneaker' + req.params.id)
})

//route for edit one sneaker by id
router.get('/sneakers/:id/edit', async (req,res) =>{
  try {
    const sneaker = await Sneaker.findById(req.params.id)
    res.render('edit.ejs', {name:req.user.name, sneaker: sneaker})
  } catch (error) {
    console.log(error)
    res.redirect('/sneakers')
    
  }
})

//route for update one sneaker by id
router.put('/sneakers/:id', upload.single("myImage"), async (req,res) =>{

  let sneaker

  try {
    sneaker = await Sneaker.findById(req.params.id)
    sneaker.name = req.body.name
    sneaker.price = req.body.price


    if (req.file != null){
      fileName = req.file.filename
      sneaker.imageName= fileName
    }
    
    
    await sneaker.save()

    console.log(sneaker)
    res.redirect('/sneakers')

  } catch {

    if (sneaker.imageName != null){removeSneakerImage(sneaker.imageName)}
    res.render('edit.ejs', {name:req.user.name, sneaker: sneaker, errorMessage: 'Error updating sneaker'})

  }

})

//route for del one sneaker by id
router.delete('/sneakers/:id', async (req,res) =>{
  let sneaker

  try {
    sneaker = await Sneaker.findById(req.params.id)
    
    await sneaker.remove()
    removeSneakerImage(sneaker.imageName)


    console.log(sneaker)
    res.redirect('/sneakers')

  } catch {

    res.render('edit.ejs', {name:req.user.name, sneaker: sneaker, errorMessage: 'Error deleting sneaker'})

  }
})

module.exports = router