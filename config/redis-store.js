const redis = require('redis');
const expressSession = require('express-session');
const RedisStore = require('connect-redis')(expressSession);
const pass = require('./password');

const redisClient = redis.createClient(6379, '127.0.0.1', {
  auth_pass: pass.redis
});

redisClient.on('error', (error) => {
  console.error(error);
});

module.exports = new RedisStore({
  client: redisClient
});