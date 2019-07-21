const express = require('express');
const router = express.Router();
const blogDao = require('./dao');
const BlogModel = require('../../models/blog.model');
const UserBlogModel = require('../../models/user-blog.model');
const AccountModel = require('../../models/account.model');

// add blog
router.post('/blog', (req, res, next) => {
  const p = req.body;
  // validate space
  if (!p.title || !p.detail || !p.tag || !p.summary) {
    res.json({
      code: 4001,
      data: null,
      msg: 'You must input some words.'
    });
    return;
  }

  // validate is logged in
  if (req.isUnauthenticated()) {
    res.json({
      code: 3999,
      data: null,
      msg: 'no authenticated'
    });
    return;
  }
  BlogModel.create({
    titleId: `hmpost${new Date().valueOf()}`,
    title: p.title,
    detail: p.detail,
    tag: p.tag,
    summary: p.summary,
    coverImage: p.coverImage
  }).then((result) => {
    console.warn(result.dataValues.id);
    UserBlogModel.create({
      userId: req.user.id,
      blogId: result.dataValues.id
    }).catch((err) => {
      console.error(err);
    });
  }).catch((err) => {
    console.error(err);
  });
});

// update blog
router.patch('/blog', (req, res, next) => {});

// create or update all properties
router.put('/blog', (req, res, next) => {});

// delete blog by id
router.delete('/blog/:id', (req, res, next) => {});

// find one blog detail by titleId
router.get('/blog/:md5', async (req, res, next) => {
  const md5 = req.params.md5;

  let blog;
  let user;
  let blogId;
  let userId;

  await BlogModel.findOne({
    where: {
      titleId: md5
    }
  }).then((result) => {
    blog = result.dataValues;
    blogId = result.dataValues.id;
  }).catch((err) => {
    console.error(err);
  });

  await UserBlogModel.findOne({
    where: {
      blogId
    }
  }).then((result) => {
    userId = result.dataValues.userId;
  }).catch((err) => {
    console.error(err);
  });

  await AccountModel.findOne({
    where: {
      id: userId
    }
  }).then((result) => {
    const tmp = result.dataValues;
    user = {
      author: tmp.name,
      authorId: tmp.uid,
      logo: tmp.logo
    };
  }).catch((err) => {
    console.error(err);
  });

  res.json({
    code: 2000,
    data: Object.assign({}, blog, user),
    msg: null
  });
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
        blogId
      }
    })
      .then(result => {
        userId = result.dataValues.userId;
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
router.get('/blogs/:page', (req, res, next) => {
  const page = +req.params.page || 1;
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
