
const express = require('express');
const router = express.Router();
const {authModel} = require('../models/auth-model');
const bcrypt = require('bcrypt');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const debug=require('debug')('server:authRouter');
const User=require('../models/auth-model');
const mongoose = require('mongoose');
const dbConfig = require('../config/db');

router.get('/signup', function(req, res) {
    
    
    let password = req.query.password;
    let username = req.query.userName;
    const saltRounds = 10;
   

    bcrypt.hash(password, saltRounds, function(err, hash) {


        password=hash;
console.log('hash length :',hash.length);

        authModel.signup({username,password}, function(err,result) {
           if(err)
           return res.json({ data: null, error: err });

          const user=getNewUserWithToken(result);
                           
         return   res.json({ data: user, error: err })
        });
    });
});
const getNewUserWithToken=(result)=>{
  return {
        id:result._id,
       username: result.username,
       email:result.email,
       token:setToken(result._id,result.username)

    };
}
const setToken=(id,userName,email)=>{
   
    const payload = {
        username: userName,
        email: email
    }
    const options = {
        subject: `${id}`,
        expiresIn: 3600
    }
    
    const token = jwt.sign(payload, 'secret123', options);
   
    return token;
}

const auth = () => {
    return (req, res, next) => {
        passport.authenticate('local', (err, passportUser,info) => {
            if (err) { return next(err); }
            
            if ( ! passportUser) {
                return res.status(403).json(info.message)
            }
            const _user=getNewUserWithToken(passportUser);
           
            res.json({user:_user,info,err});

         
        })(req, res, next);
    }
};
router.get('/login',auth());

router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
  });
// router.get('/login', function(req, res, next) {
//    const {username,password}= req.query;
    
//    req.logIn(req.body,()=>{
//     console.log('log in function',req.query);
//         res.json(req.query);
//    });
//   });
  //   mongoose.connect(dbConfig.url+dbConfig.DB,{ useNewUrlParser: true,useUnifiedTopology:true });
  
    
  //  const db= mongoose.connection;
  //  db.collection('users').findOne({username:'omer'})
  // .then((_user)=>{

 
  // console.log('user :',_user);
  
  // if(!_user){
  //   console.log('user not exist');2
  //   _user=new User();
  //   _user.username='omer';
  //   _user.password='1234';
  //     db.collection('users').insertOne(_user).then(newUser=>{
  //       res.status(200).json({"statusCode" : 200 ,"message" : "hello authenticate",user:newUser.ops});
  //     });
  // }
  // else
  // res.status(200).json({"statusCode" : 200 ,"message" : "user exist",user:_user});
//});
    //db.once('open',()=>{console.log('connection success!!')});

    
   
    //next(res);
    // passport.authenticate('local', {session: false}, function(err, user, info) {
    //     debug('hello from passport.authenticate');
    //     if (err) { return next(err); }

    //     if ( ! user) {
    //         return res.status(500).json(info.message)
    //     }

    //     const payload = {
    //         username: user.username,
    //         email: user.email
    //     }
    //     const options = {
    //         subject: `${user.id}`,
    //         expiresIn: 3600
    //     }
    //     const token = jwt.sign(payload, 'secret123', options);
        
    //     res.json({token});

    // })(req, res, next);
  

module.exports = router;	
