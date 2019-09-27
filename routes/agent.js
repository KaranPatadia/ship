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
var agent= mongoose.model('agent', userSchema);
var itemList= mongoose.model('item');


//agent Registration code
router.get('/ship/agent/regis', function(req, res, next) {
  res.render('agentReg');
});

//Storing the new details in database
router.post('/ship/agent/regis',function(req,res,next){
  var agentinfo = req.body

    var newagent= new agent({
      username: agentinfo.username,
      password: agentinfo.password
    })

   //saving the new details in database
   newagent.save(function(err,agentDetails){
     if(err)
       res.send('errors')
     else
       res.render('agentLogin')
   })
})


//agent Login Code
router.get('/ship/agent/login', function(req, res, next) {
  res.render('agentLogin',{'error':' '});
});

//Checking if login details are correct or not
router.post('/ship/agent/login',function(req,res,next){
  var agentinfo = req.body
  var check=agent.findOne({username: agentinfo.username,password: agentinfo.password}).exec((err,check)=>{
    if(check==undefined)
      res.render('agentLogin',{'error':'Incorrect username or password'});
    else{
      res.render('agentMenu');
    }
  });
});


//Redirect to agent Home Page
router.get('/ship/agent', function(req, res, next) {
  res.render('agentHome.pug');
});


//Redirect to agent Permit Page
router.get('/ship/agent/permit', function(req, res, next) {
  res.render('agentPermit.pug');
});

//Post Method to accept or reject or ammend the order
router.post('/ship/agent/permit', function(req, res, next) {
  var iteminfo = req.body
   
   var check=itemList.findOne({_id: iteminfo.id}).exec((err,check)=>{
    if(check==undefined)
      res.render('agentPermit',{'error':'Item ID does not exist!!'});
    else if(check.destination=="Not Arrived")
      res.render('agentPermit',{'error':'Order has Not Arrived at the Destination!!'});
    else if(iteminfo.status=="approve"){
      itemList.update({'_id':iteminfo.id}, {$set: {agentApp : "Approved"}}, {w:1}, function(err, result){
        if(err) res.send(err);
        res.send("Approved");
      })
    }
    else if(iteminfo.status=="reject"){
      itemList.update({'_id':iteminfo.id}, {$set: {agentApp : "Rejected"}}, {w:1}, function(err, result){
        if(err) res.send(err);
        res.send("Rejected");
      })
    }
    else
      res.render('agentPermit',{'error':'Please Select an option!!'});
  });
});

module.exports = router;
