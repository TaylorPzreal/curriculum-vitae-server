const express = require('express');
const router = express.Router();
const blogDao = require('./dao');
const BlogModel = require('../../models/blog.model');
const UserBlogModel = require('../../models/user-blog.model');
const AccountModel = require('../../models/account.model');

// add blog
router.post('/blog', (req, res, next) => {
  console.warn(req.method);
});

// update blog
router.patch('/blog', (req, res, next) => {});

// create or update all properties
router.put('/blog', (req, res, next) => {});

// delete blog by id
router.delete('/blog/:id', (req, res, next) => {});

router.get('/queryByTitleId/:titleId', (req, res, next) => {
  blogDao.queryByTitleId(req, res, next);
});

/**
 * formart blogs with user info
 * 
 * @param {any} blogs 
 * @returns 
 */
async function formatBlogs(blogs) {
  const res = [];
  for (const blog of blogs) {
    const blogId = blog.id;
    let userId;
    let user = {};

    await UserBlogModel.findOne({
      where: {
        blog_id: blogId
      }
    })
      .then(result => {
        userId = result.dataValues.user_id;
      })
      .catch(err => {
        console.error(err);
      });

    if (userId) {
      await AccountModel.findOne({
        where: {
          id: userId
        }
      })
        .then(result => {
          const tmp = result.dataValues;
          user = {
            author: tmp.name,
            logo: tmp.logo,
            uid: tmp.uid
          };
        })
        .catch(err => {
          console.error(err);
        });
    }

    res.push(Object.assign({}, blog, user));
  }

  return res;
}

// get all blogs
router.get('/blog', (req, res, next) => {
  const page = +req.query.page || 1;
  BlogModel.findAndCountAll({
    where: {},
    offset: (page - 1) * 9,
    limit: 9
  })
    .then(async result => {
      if (result && result.count > 0) {
        const resData = await formatBlogs(result.rows.map(e => e.dataValues));

        res.json({
          code: 2000,
          data: resData,
          msg: null,
          size: result.count
        });
      } else {
        res.json({
          code: 2000,
          data: null,
          msg: 'no data'
        });
      }
    })
    .catch(err => {
      console.error(err);
    });
});

// get blogs by page
router.get('/blog/:page', (req, res, next) => {
  blogDao.queryByPage(req, res, next);
});

router.get('/queryTop10Hot', (req, res, next) => {
  blogDao.queryTop10Hot(req, res, next);
});

router.post('/edit', (req, res, next) => {
  const p = req.body;
  if (p.id) {
    blogDao.updateBlog(req, res, next);
  } else {
    blogDao.saveBlog(req, res, next);
  }
});

router.get('/querySelf/:page', (req, res, next) => {
  blogDao.querySelf(req, res, next);
});

/**
 * 标签统计分析
 */
router.get('/tagStatistic', (req, res, next) => {
  blogDao.tagStatistic(req, res, next);
});

/**
 * 月blog数统计分析
 */
router.get('/monthBlogs', (req, res, next) => {
  blogDao.monthBlogs(req, res, next);
});

module.exports = router;
