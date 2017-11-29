const Sequelize = require('sequelize');
const SequelizeInstance = require('../config/sequelize');

const sequelize = SequelizeInstance();
sequelize.authenticate().then(() => {
  console.warn('Connect database has been established successfully');
}).catch((err) => {
  console.error('Unable to connect to the database: ', err);
});

const CrawlerBlogModel = sequelize.define('crawler_blog', {
  titleId: Sequelize.STRING(45),
  title: Sequelize.STRING(100),
  logo: Sequelize.STRING(255),
  visites: Sequelize.INTEGER(11),
  create_time: Sequelize.DATE,
  update_time: Sequelize.DATE,
  detail: Sequelize.TEXT,
  author: Sequelize.STRING(45)
}, {
  timestamps: false
});

module.exports = CrawlerBlogModel;
