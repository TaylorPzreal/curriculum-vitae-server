const express = require('express');
const router = express.Router();
const superagent = require('superagent');
const cheerio = require('cheerio');
const crawlerDao = require('./crawler.dao');

const mysql = require('mysql');
const conf = require('../config/db');
const sql = require('./crawler.sql');

const pool = mysql.createPool(conf.mysql);

// Crawer CNode
router.get('/cnode/getResultlist', (req, res, next) => {
  const baseURL = 'https://cnodejs.org/?tab=all&page=';

  function initCrawler () {
    const resultList = [];

    for (let i = 1; i < 3; i++) {

      setTimeout(() => {
        superagent.get(baseURL + i)
          .end((err, sres) => {
            if (err) {
              return next(err);
            }

            const $ = cheerio.load(sres.text);

            $('#topic_list .cell').each((idx, element) => {
              const dom = $(element);
              const avatar = dom.find('.user_avatar > img');
              const article = dom.find('.topic_title');

              const obj = {
                titleId: article.attr('href').replace(/\/topic\//g, ''),
                author: avatar.attr('title').replace(/\s+/g, ''),
                logo: avatar.attr('src'),
                title: article.attr('title'),
                visites: dom.find('.count_of_visits')
                  .text()
                  .replace(/\s+/g, '')
              };

              console.warn('Adding: ---------- ');
              console.warn(obj);
              crawlerDao.addCNode(obj);
            });

            // console.warn(typeof resultList);
          });
      }, 2000);
    }

    return resultList;
  }

  initCrawler();

  // res.send();
});

router.get('/cnode/getDetail', (req, res, next) => {
  const baseURL = 'https://cnodejs.org/topic/';

  // 1. 从数据库获取所有的cnode基本信息
  new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        reject('Fail');
        throw err;
      }
      connection.query(sql.queryAll, (error, resultlist) => {
        if (error) {
          throw error;
        }

        resolve(resultlist);
        res.json('Get All Success!');
      });
    });
  }).then((resultlist) => {
    // 2. 抓取所有的details

    console.warn(resultlist);
    for (let i = 0, l = resultlist.length; i < l; i++) {
      setTimeout(() => {
        superagent.get(baseURL + resultlist[i].titleId)
          .end((err, sres) => {
            if (err) {
              return next(err);
            }

            const $ = cheerio.load(sres.text);

            const obj = {
              titleId: resultlist[i].titleId,
              detail: $('.topic_content').html()
            };

            crawlerDao.addCNodeDetail(obj);
            console.warn('Search Success');
          });
      }, 5000);
    }
  });

});

// update crawler

module.exports = router;
