const Sequelize = require('sequelize');
const pass = require('./password');

const config = {
  database: 'honeymorning',
  username: 'root',
  password: pass.mysql,
  host: 'localhost',
  port: 3306
};

function SequelizeInstance() {
  return new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: 'mysql',
    pool: {
      max: 5,
      min: 0,
      idle: 30000,
      acquire: 30000
    },
    operatorsAliases: false
  });
}

module.exports = SequelizeInstance;
