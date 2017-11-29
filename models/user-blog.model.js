const Sequelize = require('sequelize');
const SequelizeInstance = require('../config/sequelize');

const sequelize = SequelizeInstance();
sequelize.authenticate().then(() => {
  console.warn('Connect database has been established successfully');
}).catch((err) => {
  console.error('Unable to connect to the database: ', err);
});

const UserBlogModel = sequelize.define('user_blog_realtion', {
  id: {
    type: Sequelize.INTEGER(11),
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  },
  user_id: Sequelize.INTEGER(11),
  blog_id: Sequelize.INTEGER(11)
}, {
  timestamps: false
});

module.exports = UserBlogModel;
