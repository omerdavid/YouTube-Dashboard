const express = require('express');
const bodyParser=require('body-parser');
const  passport  =  require('passport');
var cookieParser = require('cookie-parser');
const app = new express();


var debug=require('debug')('server');
var morgan=require('morgan');
var authRouter=require('./routes/authRouter');
var youTubeRouter= require('./routes/youTubeRouter');
//

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use(morgan('tiny'));
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());

app.use('/api/authenticate',authRouter);

app.use('/api/youTubeList',youTubeRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
  });
  
  // error handler
  app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });
  

app.listen(3000, () => {
   debug('test debug');
    console.log('App running at 3000')
})