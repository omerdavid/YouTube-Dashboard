const express = require('express');
const app=new express();
const bodyParser=require('body-parser');

var cookieParser = require('cookie-parser');
var session=require('express-session');
var debug=require('debug')('server');
var morgan=require('morgan');
var authRouter=require('./routes/authRouter');
var youTubeRouter= require('./routes/youTubeRouter');



app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cookieParser());


app.use(session({secret:'library'}));
app.use(morgan('tiny'));
require('./config/passport-config')(app);


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
    console.log('App running  at 3000')
})