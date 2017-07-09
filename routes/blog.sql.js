// CRUD SQL
const sql = {
  insert: 'INSERT INTO blog(titleId, title, author, logo, detail) VALUES(?, ?, ?, ?, ?)',
  update: 'UPDATE blog set title=?, detail=? where titleId=?',
  delete: 'DELETE FROM blog WHERE titleId=?',
  queryByTitleId: 'SELECT * FROM blog WHERE titleId=?',
  queryAll: 'SELECT * FROM blog'
};

module.exports = sql;
