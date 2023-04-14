var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var partials = require('express-partials');
var fileUploads = require('express-fileupload');
var userRouter = require('./routes/user');
var adminRouter = require('./routes/admin');
var db= require('./config/connection');
var session = require('express-session');
var app = express();
const mongoose = require('mongoose');
const dbURI = 'mongodb+srv://SJR:<pswd>@cluster0.h27exfs.mongodb.net/shopping?retryWrites=true&w=majority';

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(partials());
app.use(session({secret: "Key", saveUninitialized: true, resave: false, cookie: {maxAge: 600000}}));
app.use(fileUploads());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
mongoose.set("strictQuery", false);
mongoose.connect(dbURI, {useNewUrlParser : true, useUnifiedTopology : true},(err,data)=>{
  if(err){
      console.log(err);
  }
  else{
      console.log('Connection Successful');
  }
});

app.use('/', userRouter);
app.use('/admin', adminRouter);

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

module.exports = app;
