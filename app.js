const express = require('express');
const helmet = require('helmet'); // secure
const logger = require('morgan');
const expressSession = require('express-session');
const RedisStore = require('./config/redis-store');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

// passport local
const passport = require('./config/passport');

// common router
const router = require('./routes');

const app = express();
app.use(helmet()); // secure my express apps by setting various HTTP headers.

// ---------- GZip Compress all response -------------//
app.use(require('compression')());
// ---------- GZip End -------------//

// 设置Express的session存储中间件
app.use(cookieParser());
app.use(expressSession({
  name: 'sid',
  store: RedisStore,
  secret: 'skjdfiwnckjfwmlkrfondflewroisnfskdjfoendkfjiwehhf',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 1 * 24 * 60 * 60 * 1000 // 1 day
  }
}));

// 缓存Wechat token
app.use(expressSession({
  name: 'access_token',
  store: RedisStore,
  secret: 'skjdfiwnckjfwmlkrfondflewroisnfskdjfoendkfjiwehhf',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 7200 * 1000 // 2h
  }
}));

// 缓存 Wechat jsapi_ticket
app.use(expressSession({
  name: 'jsapi_ticket',
  store: RedisStore,
  secret: 'skjdfiwnckjfwmlkrfondflewroisnfskdjfoendkfjiwehhf',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 7200 * 1000 // 2h
  }
}));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// use passport
app.use(passport.initialize());
app.use(passport.session());

// ============ 支持跨域请求 =============//
app.all('*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:9000');
  res.header('Access-Control-Allow-Credentials', true);
  res.header('X-Frame-Options', 'ALLOW-FROM');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Content-Length, Authorization, Accept,X-Requested-With');
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
  // res.header("X-Powered-By", ' 3.2.1')
  if (req.method === 'OPTIONS') {
    res.sendStatus(200); /* 让options请求快速返回*/
  } else { 
    next();
  }
});
// ============ 跨域 End ===============//

// 所有请求都验证用户是否已经登录
// app.use((req, res, next) => {
//   if (!req.session.user) { // 未登录，如果不是登录注册找回密码页面，则跳转到登录页面
//     // res.redirect('/account/login');

//     next();
//   } else { // 已登录
//     next();
//   }
// });

// 添加 access_token
// app.use('*', (req, res, next) => {
//   // 如果没有，set cookie
//   if (!req.cookies['access_token']) {
//     res.cookie('access_token', `hm${new Date().valueOf()}`);
//   }
//   next();
// });

// ============ Route Start ==========//
app.use('/v1', router);
// ============= Route End ========//

// catch 404 and forward to error handler
app.use((req, res, next) => {
  if (!req.session) {
    return next(new Error('no session'));
  }

  const err = {
    code: 404,
    data: null,
    msg: 'Not Found!'
  };
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.msg;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.json(err);
});

module.exports = app;
