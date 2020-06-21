require('dotenv').config()
const express    = require('express');
const bodyParser = require('body-parser');
const ejs        = require('ejs');
const mongoose   = require('mongoose');
const encrypt    = require('mongoose-encryption');

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser:true, useUnifiedTopology:true});

const userSchema = new mongoose.Schema({
  email : {
    type : String,
    required : true
  },
  password : {
    type : String,
    required : true
  }
});


userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password'] });
const User = mongoose.model('User', userSchema);


app.get('/', (req,res)=>{
  res.render('home');
});

app.get('/login', (req,res)=>{
  res.render('login');
});

app.get('/register', (req,res)=>{
  res.render('register');
});


app.post('/register', (req,res)=>{
  console.log(req.body);
  new User({
    email    : req.body.email,
    password : req.body.password
  }).save((err)=>{
    if(err){
      return console.log(err);
    }
    res.render('secrets');
  });

});

app.post('/login', (req,res)=>{
  console.log(req.body);
  User.findOne({email:req.body.email}, (err, foundResult)=>{
    if(err)
      console.log(err);
    else if(foundResult==null)
      console.log('no user found');
    else if(foundResult.password === req.body.password)
      res.render('secrets');
    else
      console.log('password do not match');
    });

});




app.listen(3000, ()=>{
  console.log("Server started on port 3000");
});
