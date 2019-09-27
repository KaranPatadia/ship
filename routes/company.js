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
var company= mongoose.model('company', userSchema);
var itemList= mongoose.model('item');

//company Registration code
router.get('/ship/company/regis', function(req, res, next) {
  res.render('companyReg');
});

//Storing the new details in database
router.post('/ship/company/regis',function(req,res,next){
  var companyinfo = req.body

    var newcompany= new company({
      username: companyinfo.username,
      password: companyinfo.password
    })

   //saving the new details in database
   newcompany.save(function(err,companyDetails){
     if(err)
       res.send('errors')
     else
       res.render('companyLogin')
   })
})


//company Login Code
router.get('/ship/company/login', function(req, res, next) {
  res.render('companyLogin',{'error':' '});
});

//Checking if login details are correct or not
router.post('/ship/company/login',function(req,res,next){
  var companyinfo = req.body
  var check=company.findOne({username: companyinfo.username,password: companyinfo.password}).exec((err,check)=>{
    if(check==undefined)
      res.render('companyLogin',{'error':'Incorrect username or password'});
    else{
      res.render('companyMenu');
    }
  });
});


//Redirect to company Home Page
router.get('/ship/company', function(req, res, next) {
  res.render('companyHome');
});

//Redirect to company Date Page
router.get('/ship/company/date', function(req, res, next) {
  res.render('companyDate');
});

//Post Method to accept or reject or ammend the order
router.post('/ship/company/date', function(req, res, next) {
  var iteminfo = req.body
   
   var check=itemList.findOne({_id: iteminfo.id}).exec((err,check)=>{
    if(check==undefined)
      res.render('companyDate',{'error':'Item ID does not exist!!'});
    else if(check.status=="" || check.status=="Rejected")
      res.render('companyDate',{'error':'Approver has not approved the order!!'});
    else{
      var stdate=iteminfo.sdate;
      var endate=iteminfo.edate;

      itemList.update({'_id':iteminfo.id}, {$set: {sdate: stdate,eDate: endate,destination: 'Arrived'}}, {w:1}, function(err, result){
        if(err) res.send(err);
        res.send(stdate+"\n"+endate)
      })
    }
  });
});

module.exports = router;
