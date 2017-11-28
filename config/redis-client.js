const redis = require('redis');
const pass = require('./password');

const redisClient = redis.createClient(6379, '127.0.0.1', {
  auth_pass: pass.redis
});

redisClient.on('error', (error) => {
  console.error(error);
});

module.exports = redisClient;
