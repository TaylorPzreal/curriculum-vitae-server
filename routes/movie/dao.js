const mysql = require('mysql');
const conf = require('../../config/db');
const sql = require('./sql');

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
  queryByPage (req, res) {
    pool.getConnection((err, connection) => {
      const param = req.query || req.params;

      connection.query(sql.queryByPage, (param.page - 1)  * 10, (error, result) => {
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
  queryTopMovie (req, res) {
    pool.getConnection((err, connection) => {
      connection.query(sql.queryTopMovie, (error, result) => {
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
