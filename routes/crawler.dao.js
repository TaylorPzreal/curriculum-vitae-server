const mysql = require('mysql');
const conf = require('../config/db');
const sql = require('./crawler.sql');

const pool = mysql.createPool(conf.mysql);

module.exports = {
  addCNode (param) {
    pool.getConnection((err, connection) => {
      if (err) {
        throw err;
      }

      connection.query(sql.insertCNode, [param.titleId, param.title, param.author, param.logo, param.visites], (error, result) => {
        if (error) {
          throw error;
        } 

        // res.send(result);
        console.warn('保存成功', result);
        connection.release();
      });
    });
  },
  addCNodeDetail (param) {
    pool.getConnection((err, connection) => {
      if (err) {
        throw err;
      }

      connection.query(sql.insertCNodeDetail, [param.detail, param.titleId], (error, result) => {
        if (error) {
          throw error;
        }

        console.warn('添加详情成功');
        console.warn(result);

        connection.release();
      });
    });
  },
  queryAll () {
    pool.getConnection((err, connection) => {
      if (err) {
        throw err;
      }

      connection.query(sql.queryAll, (error, result) => {
        if (error) {
          throw error;
        }

        console.warn('获取成功', result);
        connection.release();

      });
    });
  },
  addMovieList (param) {
    pool.getConnection((err, connection) => {
      if (err) {
        throw err;
      }

      connection.query(sql.insertMovieList, [param.name, param.year, param.detailURL], (error, result) => {
        if (error) {
          throw error;
        }
        console.warn('添加Movie成功');
        console.warn(result);

        connection.release();
      });
    });
  },
  updateMovieDetail (param) {
    pool.getConnection((err, connection) => {
      if (err) {
        throw err;
      }

      connection.query(sql.updateMovieDetail, [param.summary, param.country, param.type, param.playtime, param.publicDate, param.logo, param.detailURL], (error, result) => {
        if (error) {
          throw error;
        }

        console.warn('更新Movie成功');
        connection.release();
      });
    });
  }
};
