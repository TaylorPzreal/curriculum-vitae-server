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
  login (req, res) {
    pool.getConnection((err, connection) => {
      if (err) {
        throw err;
      }
      const p = req.body;
      console.warn('test');

      const md5 = crypto.createHash('md5');
      md5.update(p.password);
      p.password = md5.digest('hex');

      connection.query(sql.queryByEmail, p.email, (error, result) => {
        if (error) {
          throw error;
        }
        result = result[0];
        if (result && result.email && result.email === p.email) {
          // exist
          if (p.password === result.password) {
            // success
            console.warn(req.session);

            if (err) {
              throw error;
            }

            req.ression.user = result;
            res.cookie('isLogin', 'true');
            // res.redirect('/');
            const resResult = {
              code: 2000,
              data: result,
              msg: 'Logged in success.'
            };

            responseJSON(res, resResult);

          } else {
            result = {
              code: 3004,
              data: null,
              msg: 'Password is wrong.'
            };
            responseJSON(res, result);
          }
        } else {
          result = {
            code: 3003,
            data: null,
            msg: 'Email does not exist.'
          };
          responseJSON(res, result);
        }
      });
    });
  }
};
