// CRUD SQL
const sql = {
  insert: 'INSERT INTO blog(titleId, title, author, authorId, logo, detail, tag, summary, coverImage) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)',
  update: 'UPDATE blog set title=?, detail=?, summary=?, tag=? where titleId=?',
  delete: 'DELETE FROM blog WHERE titleId=?',
  queryByTitleId: 'SELECT title, author, authorId, logo, ctime, detail, tag, summary, coverImage FROM blog WHERE titleId=?',
  queryAll: 'SELECT * FROM blog',
  queryByPage: 'SELECT id, title, author, visites FROM blog LIMIT 15 offset ?',
  queryTop10Hot: 'select id, title, author, visites from blog order by visites desc LIMIT 10',
  querySelf: 'select titleId, title, author, logo, tag, ctime, summary, coverImage from blog where tag <> ""',
  tagStatistic: 'select tag as name, count(*) as value from blog where tag <> "" group by tag',
  monthBlogs: 'select concat(year(ctime), "-", month(ctime)) as name, count(*) as value from blog where tag <> "" group by concat(year(ctime), "-", month(ctime))'
};

module.exports = sql;
