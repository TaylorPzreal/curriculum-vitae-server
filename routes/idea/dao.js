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
  add (req, res) {
    pool.getConnection((err, connection) => {
      if (err) {
        throw err;
      }
      const p = req.body;
      connection.query(sql.insert, [p.detail, p.uname, p.ulogo, p.uid], (error, result) => {
        if (error) {
          throw error;
        }
        result = {
          code: 2000,
          data: null,
          msg: 'Add Success'
        };
        responseJSON(res, result);
        connection.release();
      });
    });
  },
  queryMore (req, res) {
    pool.getConnection((err, connection) => {
      if (err) {
        throw err;
      }
      connection.query(sql.queryMore, (req.params.page - 1) * 15, (error, result) => {
        if (error) {
          throw error;
        }
        result = {
          code: 2000,
          data: result,
          msg: 'success'
        };
        responseJSON(res, result);
        connection.release();
      });
    });
  }, 
  changeCollection (req, res) {
    pool.getConnection((err, connection) => {
      if (err) {
        throw err;
      }
      connection.query(sql.changeCollection, [req.params.count, req.params.id], (error, result) => {
        if (error) {
          throw error;
        }
        result = {
          code: 2000,
          data: null,
          msg: 'success'
        };
        responseJSON(res, result);
        connection.release();
      });
    });
  }
};
