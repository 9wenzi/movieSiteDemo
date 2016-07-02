var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs=require('fs')
//////////////
var moment=require("moment");
var session=require("express-session");
var mongoStore=require('connect-mongo')(session);
var mongoose=require("mongoose");
mongoose.connect("mongodb://localhost/mymovie");

//model loading
var model_path=__dirname+'/modules';
var walk=function(path){
  fs
    .readdirSync(path)
    .forEach(function(file){
      var newPath=path+'/'+file;
      var stat=fs.statSync(newPath)
      if (stat.isFile) {
        if (/(.*)\.(js|coffee)/.test(file)) {
          require(newPath)
        }
      }
      else if(stat.ifDirectory){
        walk(newPath)
      }
    })
}
walk(model_path)
var routes = require('./routes/index');
//var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(require('connect-multiparty')())///文件上传中间件
app.use(express.static(path.join(__dirname, 'public')));
//
app.use(session({
  secret:"moviesite",
  resave:false,
  saveUninitialized:true,
  store:new mongoStore({
    url:'mongodb://localhost/mymovie',
    collection:'session'
  })
}))
///视图助手
app.use(function(req,res,next){
  res.locals.moment=moment;//在视图中使用moment 中间件
  var _user=req.session.user
  if(_user){
    res.locals.user=_user
  }
  next()
})


app.use('/', routes);
//app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

app.listen(2000)
console.log("listening at port 2000")
module.exports = app;
