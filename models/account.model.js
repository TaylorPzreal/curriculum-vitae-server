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
    type: Sequelize.INTEGER(11),
  },
  name: Sequelize.STRING(16),
  password: Sequelize.STRING(45),
  email: Sequelize.STRING(45),
  gender: Sequelize.BOOLEAN,
  birth: Sequelize.BIGINT,
  create_time: Sequelize.BIGINT(13),
  update_time: Sequelize.BIGINT(13)
}, {
  timestamps: false
});

module.exports = AccountModel;
