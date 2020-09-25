var passport = require('passport');
var {Strategy} = require('passport-local');
var bcrypt = require('bcrypt');

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
    {
        usernameField: 'userName',
        passwordField: 'password'
    },
    function(username, password, done) {
        
  authModel.findOne(username,function(err,user){
    
       if (!user||user.length === 0) {
          
            return done(null, false, {message: 'Incorrect username.'});
        }
       
        bcrypt.compare(password, user.password,function(err, result) {
           
            if ( ! result) {
               
                return done(null, false, {message: 'Incorrect password.'});
            }
           else{
          
            return done(null, user);
           
        }
        })
        //.then( );
    });

  
    }
));


passport.use(new JwtStrategy(options, function(jwtPayload, done) {
    authModel.findById(jwtPayload.sub, function(err, result) {
        console.log('inside JwtStrategy');
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