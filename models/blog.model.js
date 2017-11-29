const Sequelize = require('sequelize');
const SequelizeInstance = require('../config/sequelize');

const sequelize = SequelizeInstance();
sequelize.authenticate().then(() => {
  console.warn('Connect database has been established successfully');
}).catch((err) => {
  console.error('Unable to connect to the database: ', err);
});

const BlogModel = sequelize.define('blog', {
  titleId: Sequelize.STRING(45),
  title: Sequelize.STRING(100),
  create_time: Sequelize.DATE,
  update_time: Sequelize.DATE,
  detail: Sequelize.TEXT,
  tag: Sequelize.STRING(45),
  summary: Sequelize.STRING(255),
  coverImage: Sequelize.STRING(255)
}, {
  timestamps: false
});

module.exports = BlogModel;
