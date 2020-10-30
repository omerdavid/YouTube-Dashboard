const express = require('express');
const app=new express();
const bodyParser=require('body-parser');

var cookieParser = require('cookie-parser');
var session=require('express-session');

var morgan=require('morgan');
var authRouter=require('./routes/authRouter');
var youTubeRouter= require('./routes/youTubeRouter');

const logger=require('./services/log-handler');

const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
const passportConfig=require('./config/passport-config');
const mongooseService = require('./services/mongooseService.js');
 

mongooseService.connect();

 app.use(bodyParser.urlencoded({extended:true}));

app.use(bodyParser.json());

app.use(cookieParser());


//app.use(session({secret:'library'}));

app.use(morgan('tiny'));

 
 app.use(session({
  store: new MongoStore({
    mongooseConnection:mongoose.connection,
      ttl: 14 * 24 * 60 * 60 // = 14 days. Default
  }), resave: false,secret:'library',
  saveUninitialized: false
}));

passportConfig(app);



app.use('/api/authenticate',authRouter);

app.use('/api/youTubeList',youTubeRouter);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
  });

 function createError(err){
       logger.debug(err);
  }
  // error handler
  app.use(function(err, req, res) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });
  

app.listen(3000, () => {
 
  logger.debug('App running  at 3000');
   
})