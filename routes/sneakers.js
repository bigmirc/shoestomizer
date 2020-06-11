
const express = require("express")
const router = express.Router()
const Sneaker = require('../models/sneaker')
const multer = require('multer');
const path = require('path');
const SneakersRepo = require("../repositories/sneakersRepo");

const sneakersRepo = new SneakersRepo()


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

//new sneaker route
router.get('/new', checkAuthenticated, (req,res) => {
  res.render('new.ejs', {name:req.user.name, sneaker: new Sneaker()})
})



//all sneakers route
router.get('/sneakers', checkAuthenticated, async (req,res) => {
    try {
        const sneakers = await sneakersRepo.sneakers ///repo
        res.render('sneakers.ejs', {name:req.user.name, sneakers: sneakers})
    } catch (err) {
      console.log(err)
        res.redirect('/')
    }
})

//create sneaker route
router.post('/sneakers', upload.single("myImage"), async (req,res) => {

  if (req.file == null){
    fileName = ''
  } else {
    fileName = req.file.filename
  }
  const sneaker = sneakersRepo.createSneaker(req.body.name, req.body.price, fileName) ////repo

  try {
    if (sneaker.imageName === '') {throw err}
    
    const newSneaker = await sneakersRepo.saveSneaker(sneaker)
    console.log(sneaker)
    res.redirect('/sneakers')
  } catch (err) {
    if (sneaker.imageName != ''){removeSneakerImage(sneaker.imageName)}
    res.render('new.ejs', {name:req.user.name, sneaker: sneaker, errorMessage: 'Error creating sneaker'})
  }
})

//route for showing one sneaker by id
router.get('/sneakers/:id', async (req,res) =>{
  try {
    const sneaker = await sneakersRepo.findSneakerById(req.params.id) //repo

    res.render('view.ejs', {name:req.user.name, sneaker: sneaker})
  } catch (error) {
    console.log(error)
    res.redirect('/sneakers')
    
  }
})

//route for edit one sneaker by id
router.get('/sneakers/:id/edit', async (req,res) =>{
  try {
    const sneaker = await sneakersRepo.findSneakerById(req.params.id) //repo
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

    sneaker = await sneakersRepo.findSneakerById(req.params.id)

    if (req.file != null){
      sneakersRepo.removeSneakerImage(sneaker.imageName)
      sneakersRepo.editSneakerWithNewImage(sneaker, req.body.name, req.body.price,req.file, req.file.filename)
    } else {
      sneakersRepo.editSneakerWithoutNewImage(sneaker, req.body.name, req.body.price)
    }

    await sneaker.save()
    console.log(sneaker)
    res.redirect('/sneakers')

  } catch (err) {

    console.log(err)
    if (sneaker.imageName != null){sneakersRepo.removeSneakerImage(sneaker.imageName)}
    res.render('edit.ejs', {name:req.user.name, sneaker: sneaker, errorMessage: 'Error updating sneaker'})

  }

})

//route for del one sneaker by id
router.delete('/sneakers/:id', async (req,res) =>{

  let sneaker

  try {
    sneaker = await sneakersRepo.findSneakerById(req.params.id)
    await sneakersRepo.removeSneaker(sneaker)

    sneakersRepo.removeSneakerImage(sneaker.imageName)
    console.log(sneaker)
    res.redirect('/sneakers')

  } catch (err) {
    console.log(err)
    res.render('edit.ejs', {name:req.user.name, sneaker: sneaker, errorMessage: 'Error deleting sneaker'})
  }
})

module.exports = router