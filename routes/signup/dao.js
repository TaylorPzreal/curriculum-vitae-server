const mysql = require('mysql');
const crypto = require('crypto');
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
      const md5 = crypto.createHash('md5');
      md5.update(p.password);
      p.password = md5.digest('hex');

      new Promise((resolve, reject) => {
        connection.query(sql.queryByName, p.name, (error, result) => {
          if (error) {
            reject(error);
          }
          result = result[0];
          if (result && result.name && result.name === p.name) {
            // exist
            result = {
              code: 4001,
              data: null,
              msg: 'Username has exist.'
            };
            responseJSON(res, result);
            resolve(true);
          } else {
            // unexist
            resolve(false);
          }
        });
      })
        .then((hasName) => {
          if (!hasName) {
            connection.query(sql.queryByEmail, p.email, (error, result) => {
              if (error) {
                throw error;
              }
              result = result[0];
              if (result && result.email && result.email === p.email) {
                // exist
                result = {
                  code: 4002,
                  data: null,
                  msg: 'Email has exist.'
                };
                responseJSON(res, result);
                // resolve(true);
                return true;
              } else {
                // unexist
                // resolve(false);
                return false;
              }
            });
          }
        })
        .then((hasEmail) => {
          if (!hasEmail) {
            connection.query(sql.insert, [p.name, p.email, p.password], (error, result) => {
              if (error) {
                throw error;
              }
              result = {
                code: 2000,
                data: null,
                msg: 'Sign up success'
              };

              responseJSON(res, result);
              connection.release();
            });
          }
        })
        .catch((error) => {
          throw error;
        });
    });
  }
};
