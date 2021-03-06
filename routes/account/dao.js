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
  saveUser (user) {
    pool.getConnection((err, connection) => {
      if (err) {
        throw err;
      }

      connection.query(sql.saveUser, [user.id, user.name, user.email, user.location, user.age, user.company, user.avatar_url, user.bio, user.html_url, user.blog, user.followers, user.following], (error, result) => {
        if (error) {
          throw error;
        }

        // responseJSON(res, result);
        connection.release();
      });
    });
  },
  queryUserByUid (uid) {

    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) {
          reject(err);
        }

        connection.query(sql.queryUserByUid, uid, (error, result) => {
          if (error) {
            throw error;
          }

          connection.release();

          result = result[0];

          if (result && result.uid && result.uid === uid) { // exist
            resolve(result);
          } else { // unexist
            resolve(0);
          }
        });
      });
    });
  },
  updateUserById (user) {
    pool.getConnection((err, connection) => {
      if (err) {
        throw err;
      }

      connection.query(sql.updateUserById, [user.name, user.email, user.location, user.age, user.company, user.avatar_url, user.bio, user.followers, user.following, user.uid], (error, result) => {
        if (error) {
          throw error;
        }

        console.warn('用户信息跟心成功');
        connection.release();
      });
    });
  }
};
