const express = require('express');

// =============Redis===========//
const redis = require('redis');
const expressSession = require('express-session');
const RedisStore = require('connect-redis')(expressSession);
// =============Redis ==========//

const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

// Login with GitHub
const passport = require('passport');
const GithubStrategy = require('passport-github').Strategy;
const OAuthConfig = require('./config/OAuthConfig');
passport.use(new GithubStrategy({
  clientID: OAuthConfig.ClientID,
  clientSecret: OAuthConfig.ClientSecret,
  callbackURL: OAuthConfig.CallbackURL
}, (accessToken, refreshToken, profile, cb) => {
  return cb(null, profile);
}));
passport.serializeUser((user, cb) => {
  cb(null, user);
});
passport.deserializeUser((obj, cb) => {
  cb(null, obj);
});

const app = express();

// ---------- GZip Compress all response -------------//
app.use(require('compression')());
// ---------- GZip End -------------//

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
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Content-Length, Authorization, Accept,X-Requested-With');
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
  // res.header("X-Powered-By", ' 3.2.1')
  if (req.method === 'OPTIONS') {
    res.send(200); /* 让options请求快速返回*/
  } else { 
    next();
  }
});
// ============ 跨域 End ===============//

// ============ Route Start ==========//
const index = require('./routes/index');
const users = require('./routes/users');
const crawer = require('./routes/crawler');
const blog = require('./routes/blog');
const movie = require('./routes/movie');
const account = require('./routes/account');

app.use('/', index);
app.use('/users', users);
app.use('/crawler', crawer);
app.use('/blog', blog);
app.use('/movie', movie);
app.use('/account', account);
// ============= Route End ========//

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
  res.json({error: err});

});

module.exports = app;
