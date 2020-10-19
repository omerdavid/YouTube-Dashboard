
const express = require('express');
const router = express.Router();
const {authModel} = require('../models/auth-model');
const bcrypt = require('bcrypt');
const passport = require('passport');
const jwt = require('jsonwebtoken');

router.get('/signup', function(req, res) {
    
    
    let password = req.query.password;
    let username = req.query.userName;
    const saltRounds = 10;
   

    bcrypt.hash(password, saltRounds, function(err, hash) {

        password=hash;

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
    
    const token = jwt.sign(payload, 'hadasa', options);
   
    return token;
}

const auth = () => {
    return (req, res, next) => {
        passport.authenticate('local', (err, passportUser,info) => {
            if (err) { return next(err); }
            
            if ( ! passportUser) {
                return res.status(403).json(info.message)
            }
            const user=getNewUserWithToken(passportUser);
           
            res.json({data:user,info,err});

         
        })(req, res, next);
    }
};
router.get('/login',auth());

router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
  });

  

module.exports = router;	
