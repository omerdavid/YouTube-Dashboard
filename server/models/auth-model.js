//var db = require("../db");

var mongoose = require('mongoose');
const dbConfig = require('../config/db');
var bcrypt = require('bcrypt');
const logger = require('../services/log-handler');

let User= mongoose.model('User',{
        username: String,
    password: String,
    email: String,
    gender: String,
    address: String,
    
});

let authModel = {
    signup: ({username,password}, cb) => {
        
        mongoose.connect(dbConfig.url+dbConfig.DB,{ useNewUrlParser: true,useUnifiedTopology:true });
  
   
   const db= mongoose.connection;

   db.collection('users').findOne({username:username})
   .then((_user)=>{
  
   if(!_user){
  
     _user=new User();
     _user.username=username;
     _user.password=password;

       db.collection('users').insertOne(_user).then((response)=>{
        
           cb(null,response.ops[0]);
      
       }).catch(err=>{
        logger.log('auth-model :',err);
        logger.debug('auth-model :',err);
           cb(err,null)
        });
   }
   else{
    
    cb({statusCode:409},null);
   }
 
 });
    },
    findOne: (_username, cb) => {
        mongoose.connect(dbConfig.url+dbConfig.DB,{ useNewUrlParser: true,useUnifiedTopology:true });
  
    
   const db= mongoose.connection;

   db.collection('users').findOne({username:_username}).then(function(user){
    
       cb(null,user);
   })
 


     },
    findById: (_id, cb) => {
        mongoose.connect(dbConfig.url+dbConfig.DB,{ useNewUrlParser: true,useUnifiedTopology:true });
  
    
        const db= mongoose.connection;

        db.collection('users').findOne({id:_id})
        .then((_user)=>{
             cb(_user);
        });
    }
}

 module.exports ={authModel:authModel,User:User};