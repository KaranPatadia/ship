//getting required packages
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');


//connecting to the database
mongoose.connect('mongodb://localhost/ship');

//schema for the table
var userSchema = new mongoose.Schema({
    username: String,
    password: String,
    phone: Number
});
var user= mongoose.model('user', userSchema);

var itemSchema = new mongoose.Schema({
    _id: String,
    orderId: Number,
    username: String,
    type: String,
    name: String,
    qty: Number,
    status: String,
    sdate: String,
    eDate: String,
    agentApp: String,
    inspectorApp: String,
    destination: String
});
var itemList= mongoose.model('item',itemSchema);


//User Registration code
router.get('/ship/user/regis', function(req, res, next) {
  res.render('userReg');
});

//Storing the new details in database
router.post('/ship/user/regis',function(req,res,next){
  var userinfo = req.body

    var newuser= new user({
      username: userinfo.username,
      password: userinfo.password,
      phone: userinfo.phone
    })

   //saving the new details in database
   newuser.save(function(err,userDetails){
     if(err)
       res.send('errors')
     else
       res.render('userLogin')
   })
})


//User Login Code
router.get('/ship/user/login', function(req, res, next) {
  res.render('userLogin',{'error':' '});
});

//Checking if login details are correct or not
router.post('/ship/user/login',function(req,res,next){
  var userinfo = req.body
  var check=user.findOne({username: userinfo.username,password: userinfo.password}).exec((err,check)=>{
    if(check==undefined)
      res.render('userLogin',{'error':'Incorrect username or password'});
    else{
      res.cookie('user', userinfo.username);
      res.cookie('ph', check.phone);
      res.render('userMenu');
    }
  });
});


//Redirect to user Home Page
router.get('/ship/user', function(req, res, next) {
  res.render('userHome.pug');
});


//Redirect to Order Page
router.get('/ship/user/order', function(req, res, next) {
  res.render('userOrder.pug',{'user':req.cookies['user']});
});

//Post method to Store order details in table
router.post('/ship/user/order', function(req, res, next) {
  var iteminfo = req.body
  var oid= Math.floor(Math.random()*1000)
  var nid= req.cookies['user'] + req.cookies['ph'] + oid
   
  var check=itemList.findOne({username:req.cookies['user'],type:iteminfo.type,name:iteminfo.name}).exec((err,check)=>{
    if(check==undefined){
      
      var newItem= new itemList({
          _id: nid,
          orderId: oid,
          username: req.cookies['user'],
          type: iteminfo.type,
          name: iteminfo.name,
          qty: iteminfo.qty,
          status: '',
          sdate: '',
          eDate: '',
          agentApp: '',
          inspectorApp: '',
          destination: 'Not Arrived'
      })
      //saving the items in the table
      newItem.save(function(err,itemDetails){
        if(err)
          res.send('errors else ')
        else
          res.send(newItem)
      })
    }
    else
      res.render('userOrder',{'error':'One user cannot create same order with same order type!'});
  });
});


module.exports = router;
