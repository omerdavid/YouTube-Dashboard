var passport = require('passport');
var {Strategy} = require('passport-local');
var bcrypt = require('bcrypt');
//const { authModel} = require('./models/auth-model');
const {authModel}=require('../models/auth-model')
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;

function passportConfig(app){

    app.use(passport.initialize());
    app.use(passport.session());

    


//Store user in session
passport.serializeUser(function(user, done) {
    if(user) done(null, user.id);
});
  //Retrieve user from session
passport.deserializeUser(function(id, done) {
    done(null, id);
});

var options = {};
options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
options.secretOrKey = 'secret123'; 

passport.use(new Strategy(
    function(username, password, done) {
      User.findOne({ username: username }, function (err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false); }
        if (!user.verifyPassword(password)) { return done(null, false); }
        return done(null, user);
      });
    }
  ));

passport.use(new Strategy(
    {
        usernameField: 'userName',
        passwordField: 'password'
    },
    function(username, password, done) {
       
       
     
         console.log(username);
  authModel.findOne(username,function(err,result){

   
           
      // if (err) { return done(err); }
    
       if (!result||result.length === 0) {
          
            return done(null, false, {message: 'Incorrect username.'});
        }
       
       
        const user = result;
        if ( password!= user.password) {
            console.log('in correct password')
            return done(null, false, {message: 'Incorrect password.'});
        }
      
        return done(null, user);
        // bcrypt.compare(password, user.password).then( function(err, result) {
           
        //     if ( ! result) {
        //         return done(null, false, {message: 'Incorrect password.'});
        //     }
        //    else
        //     return done(null, user);
        // });
    });

  
    }
));


passport.use(new JwtStrategy(options, function(jwtPayload, done) {
    authModel.findById(jwtPayload.sub, function(err, result) {
        console.log('inside findById');
        if (err) {
            return done(err, false);
        }

        if (result.length === 0) {
            return done(null, false);
        }

        return done(null, result[0]);
    })
}));

};
module.exports=passportConfig;