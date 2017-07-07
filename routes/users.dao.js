const mysql = require('mysql');
const conf = require('../config/db');
const sql = require('./users.sql');

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
      const param = req.body;
      connection.query(sql.insert, [param.name, param.age], (result) => {

        if (result) {
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
  }
};
