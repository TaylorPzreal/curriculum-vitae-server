const mysql = require('mysql');
const conf = require('../config/db');
const sql = require('./blog.sql');

const pool = mysql.createPool(conf.mysql);

function responseJSON (res, result) {
  if (typeof result === undefined) {
    res.json({
      code: 4000,
      msg: '操作失败'
    });
  } else {
    res.json(result);
  }
}

module.exports = {
  queryByTitleId (req, res) {
    pool.getConnection((err, connection) => {
      if (err) {
        throw err;
      }

      connection.query(sql.queryByTitleId, req.query.titleId, (error, result) => {
        if (error) {
          throw error;
        }

        result = {
          code: 2000,
          data: result,
          msg: 'Success'
        };

        responseJSON(res, result);
        connection.release();
      });
    }); 
  },
  queryAll (req, res) {
    pool.getConnection((err, connection) => {
      if (err) {
        throw err;
      }
      connection.query(sql.queryAll, (error, result) => {
        if (error) {
          throw error;
        }

        result = {
          code: 2000,
          data: result,
          msg: 'Success'
        };

        responseJSON(res, result);
        connection.release();
      });
    });
  }
};
