require('should');

const mysql = require('mysql');
const conf = require('../config/db');
const sql = require('../routes/movie/sql');

const pool = mysql.createPool(conf.mysql);

describe('测试电影的增删改查', () => {
  it('length should equal 10 when page === 1', () => {

    pool.getConnection((err, connection) => {
      if (err) {
        throw err;
      }
      connection.query(sql.queryByPage, 1, (error, result) => {
        if (error) {
          throw error;
        }
        result.length.should.equal(10);
        
        connection.release();
      });
    });

  });
});
