const express = require('express');
const router = express.Router();
const superagent = require('superagent');
const formatSuperagent = require('superagent-charset');
const cheerio = require('cheerio');
const crawlerDao = require('./crawler.dao');
const mapLimit = require('async/mapLimit');
// const iconv = require('iconv-lite');

const mysql = require('mysql');
const conf = require('../config/db');
const sql = require('./crawler.sql');

const pool = mysql.createPool(conf.mysql);

// 并发连接数的计数器
let concurrencyCount = 0;
const fetchUrl = function (url, callback, crawlerFun) {
  // console.warn(url, callback);
  const delay = parseInt(Math.random() * 10000000 % 2000, 10);
  // const delay = 3000;
  concurrencyCount++;
  console.warn(`现在并发数是：${concurrencyCount}, 正在访问的URL是：${url}, 耗时：${delay}`);
  setTimeout(() => {
    concurrencyCount--;

    callback(null, crawlerFun(url));
  }, delay);
};

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
        connection.release();
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

// Crawl Movies

/**
 * 抓取电影天堂电影
 * 
 * @param {any} url 
 * @returns 
 */
function crawlerMovie (url) {
  const resultList = [];

  formatSuperagent(superagent).get(url)
    .charset('gb2312')
    .end((err, sres) => {
      if (err) {
        throw err;
      }

      // iconv.decode(sres.text, 'gb2312')
      const $ = cheerio.load(sres.text, {
        decodeEntities: false
      });
      const baseURL = 'http://www.dytt8.net';

      $('.co_content8 table').each((idx, element) => {
        const dom = $(element);
        const a = dom.find('a.ulink');

        const obj = {
          name: a.text().match(/《(.)+》/igm)[0],
          detailURL: baseURL + a.attr('href'),
          year: a.text().match(/^\d{4}/)[0]
        };
        resultList.push(obj);

        crawlerDao.addMovieList(obj);

        console.warn(obj);
      });
    });

  return resultList;
}

router.get('/movie/getResultList', (req, res, next) => {

  (function () {

    const urls = [];
    for (let i = 1; i <= 10; i++) {
      urls.push(`http://www.dytt8.net/html/gndy/dyzz/list_23_${i}.html`);
    }

    mapLimit(urls, 5, (url, callback) => {
      fetchUrl(url, callback, crawlerMovie);
    }, (err, results) => {
      if (err) {
        console.error('ERROR: ', err);
      }
      console.warn('添加中。。。');
    });
  })();
});

function crawlerMovieDetail (url) {
  formatSuperagent(superagent).get(url)
    .charset('gb2312')
    .end((err, sres) => {
      if (err) {
        throw err;
      }

      const $ = cheerio.load(sres.text, {
        decodeEntities: false
      });

      const dom = $('#Zoom>span>p').first();
      const detail = dom.text();
      const logo = $(dom.children('img')[0]).attr('src');

      const obj = {
        summary: detail.match(/◎简(.)+介(.)+$/g) ? detail.match(/◎简(.)+介(.)+$/g)[0].replace(/◎简(.)+介\s+/, '').replace(/◎(.)+$/, '') : '',
        country: detail.match(/◎国\s+家(.)+$/g) ? detail.match(/◎国\s+家(.)+$/g)[0].replace(/◎国\s+家\s+/, '').replace(/◎(.)+$/, '') : '',
        type: detail.match(/◎类\s+别(.)+$/g) ? detail.match(/◎类\s+别(.)+$/g)[0].replace(/◎类\s+别\s+/, '').replace(/◎(.)+$/, '') : '',
        playtime: detail.match(/◎片\s+长(.)+$/g) ? detail.match(/◎片\s+长(.)+$/g)[0].replace(/◎片\s+长\s+/, '').replace(/◎(.)+$/, '') : '',
        publicDate: $('.co_content8 ul')
          .text()
          .match(/发布时间：[\d|-]{10}/g)[0]
          .replace(/\s/g, '')
          .replace(/发布时间：/, ''),
        logo,
        detailURL: url 
      };

      crawlerDao.updateMovieDetail(obj);

    });
}

router.get('/movie/getDetail', (req, res, next) => {
  
  new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        reject(err);
      }

      connection.query(sql.queryMovies, (error, results) => {
        if (error) {
          throw error;
        }

        resolve(results);
        connection.release();
      });
    });
  }).then((resultList) => {
    res.json({code: 200, msg: '获取所有电影成功'});
    
    const urls = [];
    resultList.forEach((e) => {
      urls.push(e.detailURL);
    });
    // const urls = [
    //   'http://www.dytt8.net/html/gndy/dyzz/20161031/52360.html',
    //   'http://www.dytt8.net/html/gndy/dyzz/20170327/53562.html',
    //   'http://www.dytt8.net/html/gndy/dyzz/20170318/53507.html',
    //   'http://www.dytt8.net/html/gndy/dyzz/20170416/53745.html',
    //   'http://www.dytt8.net/html/gndy/dyzz/20170416/53744.html',
    //   'http://www.dytt8.net/html/gndy/dyzz/20170413/53726.html',
    //   'http://www.dytt8.net/html/gndy/dyzz/20170514/53986.html',
    //   'http://www.dytt8.net/html/gndy/dyzz/20170316/53482.html',
    //   'http://www.dytt8.net/html/gndy/dyzz/20170310/53447.html',
    //   'http://www.dytt8.net/html/gndy/dyzz/20170310/53446.html',
    //   'http://www.dytt8.net/html/gndy/dyzz/20161217/52754.html'
    // ];

    mapLimit(urls, 5, (url, callback) => {
      fetchUrl(url, callback, crawlerMovieDetail);
    }, (error, results) => {
      if (error) {
        throw error;
      }
      console.warn('添加电影详情数据中...');
    });


  });
});

module.exports = router;
