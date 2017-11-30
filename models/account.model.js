const Sequelize = require('sequelize');
const SequelizeInstance = require('../config/sequelize');

const sequelize = SequelizeInstance();
sequelize.authenticate().then(() => {
  console.warn('Connect database has been established successfully');
}).catch((err) => {
  console.error('Unable to connect to the database: ', err);
});

// User Model
const AccountModel = sequelize.define('user', {
  uid: {
    type: Sequelize.STRING(15),
  },
  name: Sequelize.STRING(16),
  password: Sequelize.STRING(45),
  email: Sequelize.STRING(45),
  gender: Sequelize.BOOLEAN,
  birth: Sequelize.BIGINT,
  createTime: Sequelize.BIGINT(13),
  updateTime: Sequelize.BIGINT(13),
  logo: Sequelize.STRING(255)
}, {
  timestamps: false
});

module.exports = AccountModel;
