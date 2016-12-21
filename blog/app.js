var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
const session = require( 'express-session');
var bodyParser = require('body-parser');

var index = require('./routes/home/index');
//引入自定义模块posts.js
var posts = require('./routes/home/posts');

var users = require('./routes/admin/users');
var cats = require('./routes/admin/cats');
var article = require('./routes/admin/posts');
var admin = require('./routes/admin/index');
var app = express();
//使用session中间件
app.use(session({
  secret: 'clown',
  resave: false,
  saveUninitialized: true,
  cookie: {}
}));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
//设置将。html文件作为模板文件
app.engine('html',require('ejs').__express);
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views/admin')));



app.use('/', index);
app.use('/posts', posts);
app.use('/user',users);

app.use('/admin',checkLogin);
app.use('/admin',admin);
//针对admin/posts的请求，交给article来处理
//app.use('/admin/posts',checkLogin);
app.use('/admin/posts',article);
//针对catss的请求，交给cats中间件处理
//app.use('/admin/cats',checkLogin);
app.use('/admin/cats',cats);

app.use("/users",users);
//自定义中间件，用于判断用户是否已经登录；
function checkLogin(req,res,next){
  if(!req.session.isLogin){
    res.redirect('/user/login');
    return;
  }
  //已经登录，继续执行后续的代码
  next();
}


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
