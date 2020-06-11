
const express = require("express")
const router = express.Router()
const Sneaker = require('../models/sneaker')
const Order = require('../models/order')
const multer = require('multer');
const path = require('path');
const fs = require('fs')

const OrdersRepo = require("../repositories/OrdersRepo");
const ordersRepo = new OrdersRepo()
const SneakersRepo = require("../repositories/SneakersRepo");
const sneakersRepo = new SneakersRepo()
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
// function removeOrderImage(fileName){
//   fs.unlink(path.join('./public/designUploads/',fileName), err =>{
//     if (err) console.log(err)
//   })

// }

//all orders route
router.get('/orders', checkAuthenticated, async (req,res) => {
    try {
        const orders = await ordersRepo.orders
        res.render('orders.ejs', {name:req.user.name, orders:orders})
    } catch  {
        res.redirect('/')
    }
})

//new order route
router.get('/newOrder/:id', checkAuthenticated, async (req,res) => {

  const sneaker = await sneakersRepo.findSneakerById(req.params.id)
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

  const order =  ordersRepo.createOrder(
      req.body.name,
      req.user.name,
      req.body.price,
      req.body.size,
      req.body.address,
      req.body.phoneNumber,
      fileName
    )

  try {
    if (order.designName === '') {throw err}

    const newOrder = await ordersRepo.saveOrder(order)
    console.log(order)
    res.redirect('/orders')

  } catch  (err) {


    if (order.designName != ''){ordersRepo.removeOrderImage(order.designName)}
    const sneaker = sneakersRepo.createSneaker(
      req.body.name,
      req.body.price,
      ''
    )

    res.render('newOrder.ejs', {name:req.user.name, sneaker:sneaker, errorMessage: 'Order Error - add an image'})



  }
})


module.exports = router