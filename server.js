if (process.env.NODE_ENV !=='production'){
    require('dotenv').config(); // sets env variables
}



const express = require('express'); //iti trb express pt calls
const app = express();
const bcrypt = require('bcrypt');  //bcrypt for hashing passwords
const passport = require('passport'); //for users
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const initializePassport = require('./passport-config');
const bodyParser = require ('body-parser')

initializePassport(
    passport,
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
)




const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL, {useUnifiedTopology:true, useNewUrlParser: true})  //using env variable
const db = mongoose.connection

db.on('error', error => console.error(error))
db.once('open', () => console.log('connected to Mongoose'))



const users=[]; //variabila locala pt useri - fa un db in schimb

app.use("/styles",express.static(__dirname + "/styles")); //
app.use("/images",express.static(__dirname + "/images"));
app.use("/js_functional",express.static(__dirname + "/js_functional"));
app.set('view-engine','ejs')
app.use(express.urlencoded({extended:false})); //to use the forms
app.use(flash())
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized:false
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"))
app.use(bodyParser.urlencoded({limit:'10mb', extended: false}))

// app.get('/', checkAuthenticated, (req,res) =>{
//     res.render('index.ejs', {name: req.user.name});
// })
const indexRouter = require('./routes/index')
app.use('/', indexRouter)


// app.get('/customize', checkAuthenticated, (req,res) =>{
//     res.render('customize.ejs', {name: req.user.name});
// })
const customizeRouter = require('./routes/customize')
app.use('/', customizeRouter)



// app.get('/login',checkNotAuthenticated, (req,res)=>{
//     res.render('login.ejs');
// })
const loginRouter = require('./routes/login')
app.use('/', loginRouter)

// app.get('/register',checkNotAuthenticated, (req,res)=>{
//     res.render('register.ejs');
// });
const registerRouter = require('./routes/register')
app.use('/', registerRouter)


app.post('/login',checkNotAuthenticated, passport.authenticate('local', {
    successRedirect:'/',
    failureRedirect:'/login',
    failureFlash:true
}))


app.post('/register',checkNotAuthenticated, async (req,res)=>{
    
    try{
        const hashedPassword = await bcrypt.hash(req.body.password,10); //10 - how many times do you want it hashed? 10 makes it quick and secure.
        users.push({
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        });
        res.redirect('/login');
    } catch{
        console.log('numere')
        res.redirect('/register');
    }
    console.log(users);
});

app.delete('/logout', (req, res) => {
    req.logOut();
    res.redirect('/login')
})


function checkNotAuthenticated(req, res, next){
    if (req.isAuthenticated()){
        return res.redirect('/');
    }
    next();
}


app.listen(3000);