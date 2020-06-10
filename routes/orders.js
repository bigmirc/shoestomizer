
const express = require("express")
const router = express.Router()
const Sneaker = require('../models/sneaker')
const Order = require('../models/order')
const multer = require('multer');
const path = require('path');
const fs = require('fs')

// Set The Storage Engine
const storage = multer.diskStorage({
  destination: './public/designUploads/',
  filename: function(req, file, cb){
    cb(null,'design' + Date.now() + path.extname(file.originalname));
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

//remove image if order's not created properly
function removeOrderImage(fileName){
  fs.unlink(path.join('./public/designUploads/',fileName), err =>{
    if (err) console.log(err)
  })

}

//all orders route
router.get('/orders', checkAuthenticated, async (req,res) => {
    try {
        const orders = await Order.find({})
        res.render('orders.ejs', {name:req.user.name, orders:orders})
    } catch  {
        res.redirect('/')
    }
})

//new order route
router.get('/newOrder/:id', checkAuthenticated, async (req,res) => {

  const sneaker = await Sneaker.findById(req.params.id)
  console.log(sneaker)
  res.render('newOrder.ejs', {name:req.user.name, sneaker: sneaker})
})


//create order route
router.post('/orders', checkAuthenticated, upload.single("myDesign"), async (req,res) => {

  if (req.file == null){
    fileName = ''
  } else {
    fileName = req.file.filename
  }

  const order = new Order({
      sneakerName: req.body.name,
      username: req.user.name,
      price:req.body.price,
      size:req.body.size,
      address:req.body.address,
      phoneNumber:req.body.phoneNumber,
      designName: fileName

  })

  try {
    const newOrder = await order.save()
    console.log(order)
    res.redirect('/orders')

  } catch  (err) {


    if (order.designName != ''){removeOrderImage(order.designName)}
    const sneaker = new Sneaker({
      name: req.body.name,
      price: req.body.price,
      imageName: ''

  })
    if ( req.file == null){
      res.render('newOrder.ejs', {name:req.user.name, sneaker:sneaker, errorMessage: 'Order Error - Upload an Image! '})
    } else
    if ( req.body.price == ''){
      res.render('newOrder.ejs', {name:req.user.name, sneaker:sneaker, errorMessage: 'Order Error - Fill Price field '})
    } else
    if ( req.body.size == ''){
      res.render('newOrder.ejs', {name:req.user.name, sneaker:sneaker, errorMessage: 'Order Error - Fill Size field! '})
    } else
    if ( req.body.address == ''){
      res.render('newOrder.ejs', {name:req.user.name, sneaker:sneaker, errorMessage: 'Order Error - Fill Address field! '})
    } else
    if ( req.body.phoneNumber == ''){
      res.render('newOrder.ejs', {name:req.user.name, sneaker:sneaker, errorMessage: 'Order Error - Fill Phone Number field! '})
    } else {res.render('newOrder.ejs', {name:req.user.name, sneaker:sneaker, errorMessage: 'Order Error'})}



  }
})


module.exports = router