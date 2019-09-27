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
var inspector= mongoose.model('inspector', userSchema);
var itemList= mongoose.model('item');

//inspector Registration code
router.get('/ship/inspector/regis', function(req, res, next) {
  res.render('inspectorReg');
});

//Storing the new details in database
router.post('/ship/inspector/regis',function(req,res,next){
  var inspectorinfo = req.body

    var newinspector= new inspector({
      username: inspectorinfo.username,
      password: inspectorinfo.password
    })

   //saving the new details in database
   newinspector.save(function(err,inspectorDetails){
     if(err)
       res.send('errors')
     else
       res.render('inspectorLogin')
   })
})


//inspector Login Code
router.get('/ship/inspector/login', function(req, res, next) {
  res.render('inspectorLogin',{'error':' '});
});

//Checking if login details are correct or not
router.post('/ship/inspector/login',function(req,res,next){
  var inspectorinfo = req.body
  var check=inspector.findOne({username: inspectorinfo.username,password: inspectorinfo.password}).exec((err,check)=>{
    if(check==undefined)
      res.render('inspectorLogin',{'error':'Incorrect username or password'});
    else{
      res.render('inspectorMenu');
    }
  });
});


//Redirect to inspector Home Page
router.get('/ship/inspector', function(req, res, next) {
  res.render('inspectorHome.pug');
});


//Redirect to inspector Permit Page
router.get('/ship/inspector/permit', function(req, res, next) {
  res.render('inspectorPermit.pug');
});

//Post Method to accept or reject or ammend the order
router.post('/ship/inspector/permit', function(req, res, next) {
  var iteminfo = req.body
   
   var check=itemList.findOne({_id: iteminfo.id}).exec((err,check)=>{
    if(check==undefined)
      res.render('inspectorPermit',{'error':'Item ID does not exist!!'});
    else if(check.agentApp=="" || check.agentApp=="Rejected")
      res.render('inspectorPermit',{'error':'Agent has not approved the order!!'});
    else if(iteminfo.status=="approve"){
      itemList.update({'_id':iteminfo.id}, {$set: {inspectorApp : "Approved"}}, {w:1}, function(err, result){
        if(err) res.send(err);
        res.send("Approved");
      })
    }
    else if(iteminfo.status=="reject"){
      itemList.update({'_id':iteminfo.id}, {$set: {inspectorApp : "Rejected"}}, {w:1}, function(err, result){
        if(err) res.send(err);
        res.send("Rejected");
      })
    }
    else
      res.render('inspectorPermit',{'error':'Please Select an option!!'});
  });
});

module.exports = router;
