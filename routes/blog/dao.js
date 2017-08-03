const crypto = require('crypto');
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
  queryByTitleId (req, res) {
    pool.getConnection((err, connection) => {
      if (err) {
        throw err;
      }

      connection.query(sql.queryByTitleId, req.params.titleId, (error, result) => {
        if (error) {
          throw error;
        }

        result[0].desc = result[0].summary; // transfer

        result = {
          code: 2000,
          data: result[0],
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
  },
  queryByPage (req, res) {
    pool.getConnection((err, connection) => {
      if (err) {
        throw err;
      }
      const page = req.params.page || 1;

      connection.query(sql.queryByPage, (page - 1) * 10, (error, result) => {
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
  queryTop10Hot (req, res) {
    pool.getConnection((err, connection) => {
      if (err) {
        throw err;
      }

      connection.query(sql.queryTop10Hot, (error, result) => {
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
  querySelf (req, res) {
    pool.getConnection((err, connection) => {
      if (err) {
        throw err;
      }
      const page = req.params.page || 1;
      connection.query(sql.querySelf, page, (error, result) => {
        if (error) {
          throw error;
        }

        result = {
          code: 2000,
          data: result,
          msg: 'query success'
        };

        responseJSON(res, result);
        connection.release();
      });
    });
  },
  saveBlog (req, res) {
    pool.getConnection((err, connection) => {
      if (err) {
        throw err;
      }
      const p = req.body;
      const date = `hm${(new Date()).valueOf()}`;
      const md5 = crypto.createHash('md5');
      md5.update(date);
      p.titleId = md5.digest('hex');

      connection.query(sql.insert, [p.titleId, p.title, p.author, p.authorId, p.logo, p.detail, p.tag, p.desc, p.coverImage], (error, result) => {
        if (error) {
          throw error;
        }
        result = {
          code: 2000,
          data: null,
          msg: 'Insert Blog Success'
        };
        responseJSON(res, result);
        connection.release();
      });
    });
  },
  updateBlog (req, res) {
    pool.getConnection((err, connection) => {
      if (err) {
        throw err;
      }
      const p = req.body;

      connection.query(sql.update, [p.title, p.detail, p.desc, p.tag, p.coverImage, p.id], (error, result) => {
        if (error) {
          throw error;
        }
        result = {
          code: 2001,
          data: null,
          msg: 'Update Blog Success'
        };
        responseJSON(res, result);
        connection.release();
      });
    });
  },
  tagStatistic (req, res) {
    pool.getConnection((err, connection) => {
      if (err) {
        throw err;
      }

      connection.query(sql.tagStatistic, (error, result) => {
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
  monthBlogs (req, res) {
    pool.getConnection((err, connection) => {
      if (err) {
        throw err;
      }

      connection.query(sql.monthBlogs, (error, result) => {
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
