const Sequelize = require('sequelize');
const SequelizeInstance = require('../../config/sequelize');

const sequelize = SequelizeInstance();

sequelize.authenticate().then(() => {
  console.warn('Connect database has been established successfully');
}).catch((err) => {
  console.error('Unable to connect to the database: ', err);
});

const Account = sequelize.define('user', {

});
