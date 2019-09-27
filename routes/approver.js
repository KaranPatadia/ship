//getting required packages
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');


//connecting to the database
mongoose.connect('mongodb://localhost/ship');

//schema for the table
var userSchema = new mongoose.Schema({
    username: String,
    password: String
});
var approver= mongoose.model('approver', userSchema);
var itemList= mongoose.model('item');

//approver Registration code
router.get('/ship/approver/regis', function(req, res, next) {
  res.render('approverReg');
});

//Storing the new details in database
router.post('/ship/approver/regis',function(req,res,next){
  var approverinfo = req.body

    var newapprover= new approver({
      username: approverinfo.username,
      password: approverinfo.password
    })

   //saving the new details in database
   newapprover.save(function(err,approverDetails){
     if(err)
       res.send('errors')
     else
       res.render('approverLogin')
   })
})


//approver Login Code
router.get('/ship/approver/login', function(req, res, next) {
  res.render('approverLogin',{'error':' '});
});

//Checking if login details are correct or not
router.post('/ship/approver/login',function(req,res,next){
  var approverinfo = req.body
  var check=approver.findOne({username: approverinfo.username,password: approverinfo.password}).exec((err,check)=>{
    if(check==undefined)
      res.render('approverLogin',{'error':'Incorrect username or password'});
    else{
      res.render('approverMenu');
    }
  });
});


//Redirect to approver Home Page
router.get('/ship/approver', function(req, res, next) {
  res.render('approverHome');
});


//Redirect to Approver Permit page
router.get('/ship/approver/permit', function(req, res, next) {
  res.render('approverPermit');
});

//Post Method to accept or reject or ammend the order
router.post('/ship/approver/permit', function(req, res, next) {
  var iteminfo = req.body

  var check=itemList.findOne({_id: iteminfo.id}).exec((err,check)=>{
    if(check==undefined)
      res.render('approverPermit',{'error':'Item ID does not exist!!'});
    else if(iteminfo.status=="approve"){
      itemList.update({'_id':iteminfo.id}, {$set: {status : "Order Approved"}}, {w:1}, function(err, result){
        if(err) res.send(err);
      })
      res.send("Approved");
    }
    else if(iteminfo.status=="reject"){
      itemList.update({'_id':iteminfo.id}, {$set: {status : "Order Rejected"}}, {w:1}, function(err, result){
        if(err) res.send(err);
      })
      res.send("Rejected");
    }
    else if(iteminfo.status=="ammend"){
      res.render('approverAmmend');
    }
  });
});

//Post Method to ammend the order
router.post('/ship/approver/ammend', function(req, res, next) {
  var iteminfo = req.body
   
   var check=itemList.findOne({_id: iteminfo.id}).exec((err,check)=>{
    if(check==undefined)
      res.render('approverAmmend',{'error':'Item ID does not exist!!'});
    else{
      itemList.update({'_id':iteminfo.id}, {$set: {qty : iteminfo.qty,status : " Order modified and Approved"}}, {w:1}, function(err, result){
        if(err) res.send(err);
        res.render('approverMenu');
      })
    }
  });
});

module.exports = router;
