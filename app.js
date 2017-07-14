const express = require('express');
const expressSession = require('express-session');
const redis = require('redis');
const RedisStore = require('connect-redis')(expressSession);

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
const redisClient = redis.createClient(6379, '127.0.0.1', {auth_pass: '521morning'});
// 设置Express的session存储中间件
app.use(cookieParser());
app.use(expressSession({store: new RedisStore({client: redisClient}), secret: '521morning', resave: false, saveUninitialized: false}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(express.static(path.join(__dirname, 'public')));

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
  res.render('error');

});

module.exports = app;
