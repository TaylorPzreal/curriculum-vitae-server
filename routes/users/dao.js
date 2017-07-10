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
      const param = req.query;
      connection.query(sql.insert, [param.name, param.age], (error, result) => {
        if (err) {
          throw err;
        } else {
          result = {
            code: 2000,
            msg: '添加成功'
          };
        }

        responseJSON(res, result);

        // 释放连接
        connection.release();
      });
    });
  },
  queryById (req, res) {
    pool.getConnection((err, connection) => {
      const id = req.query.id;
      
      connection.query(sql.queryById, id, (error, result) => {
        console.warn(error, result);
        if (err) {
          throw err;
        } else {
          responseJSON(res, result);
          connection.release();
        }
      });
    });
  },
  queryAll (req, res) {
    pool.getConnection((err, connection) => {
      connection.query(sql.queryAll, (error, result) => {
        responseJSON(res, result);
        connection.release(); 
      });
    });
  },
  update (req, res) {
    const param = req.query;

    if (param.name === null || param.age === null || param.id === null) {
      responseJSON(res, undefined);
      return;
    }

    pool.getConnection((err, connection) => {
      connection.query(sql.update, [param.name, param.age, +param.id], (err, result) => {
        if (err) {
          throw err;
        } else {
          result = {
            code: 2000,
            msg: 'Update Success'
          };
          responseJSON(res, result);
          connection.release();
        }
      });
    });
  },
  delete (req, res) {
    const id = req.query.id;

    pool.getConnection((err, connection) => {
      connection.query(sql.delete, id, (err, result) => {
        if (err) {
          throw err;
        } else {
          result = {
            code: 2000,
            msg: 'Delete Success.'
          };
          responseJSON(res, result);
          connection.release();
        }
      });
    });
  }
};
