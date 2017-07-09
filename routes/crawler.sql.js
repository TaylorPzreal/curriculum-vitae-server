const sql = {
  insertCNode: 'INSERT INTO blog(id, titleId, title, author, logo, visites) VALUES(0, ?, ?, ?, ?, ?)',
  insertCNodeDetail: 'UPDATE blog SET detail=? where titleId=?',
  queryAll: 'SELECT * FROM blog'
};

module.exports = sql;
