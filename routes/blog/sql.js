// CRUD SQL
const sql = {
  insert: 'INSERT INTO blog(titleId, title, author, authorId, logo, detail, tag, summary, coverImage) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)',
  update: 'UPDATE blog set title=?, detail=? where titleId=?',
  delete: 'DELETE FROM blog WHERE titleId=?',
  queryByTitleId: 'SELECT title, author, authorId, logo, ctime, detail, tag FROM blog WHERE titleId=?',
  queryAll: 'SELECT * FROM blog',
  queryByPage: 'SELECT id, title, author, visites FROM blog LIMIT 15 offset ?',
  queryTop10Hot: 'select id, title, author, visites from blog order by visites desc LIMIT 10',
  querySelf: 'select titleId, title, author, logo, tag, ctime, summary, coverImage from blog where tag <> ""'
};

module.exports = sql;
