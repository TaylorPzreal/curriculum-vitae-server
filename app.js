const express = require('express');
const expressSession = require('express-session');
const redis = require('redis');
const RedisStore = require('connect-redis')(expressSession);
const passport = require('passport');

const path = require('path');
// const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const index = require('./routes/index');
const users = require('./routes/users');
const crawer = require('./routes/crawler');
const blog = require('./routes/blog');
const movie = require('./routes/movie');
const account = require('./routes/account');

const app = express();

// 创建Redis客户端
const redisClient = redis.createClient(6379, '127.0.0.1', {
  auth_pass: '521morning'
});
// 设置Express的session存储中间件
app.use(cookieParser());
app.use(expressSession({
  store: new RedisStore({
    client: redisClient
  }),
  secret: '521morning',
  resave: false,
  saveUninitialized: false
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(express.static(path.join(__dirname, 'public')));

// 跨域支持
// 支持跨域请求
// app.all('*', (req, res, next) => {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Headers', 'Content-Type,Content-Length, Authorization, Accept,X-Requested-With');
//   res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
//   // res.header("X-Powered-By", ' 3.2.1')
//   if (req.method === 'OPTIONS') {
//     res.send(200); /* 让options请求快速返回*/
//   } else { 
//     next();
//   }
// });

// app.use(cors());

app.use('/', index);
app.use('/users', users);
app.use('/crawler', crawer);
app.use('/blog', blog);
app.use('/movie', movie);
app.use('/account', account);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  if (!req.session) {
    return next(new Error('no session'));
  }

  const err = new Error('Not Found');
  err.status = 404;
  next(err);

});

// error handler
app.use((err, req, res, next) => {

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json('error');

});

module.exports = app;
