const sql = {
  insertCNode: 'INSERT INTO blog(id, titleId, title, author, logo, visites) VALUES(0, ?, ?, ?, ?, ?)',
  insertCNodeDetail: 'UPDATE blog SET detail=? where titleId=?',
  queryAll: 'SELECT * FROM blog',
  insertMovieList: 'INSERT INTO movie(id, name, year, detailURL) VALUES(0, ?, ?, ?)',
  queryMovies: 'SELECT * FROM movie',
  updateMovieDetail: 'UPDATE movie SET summary=?, country=?, type=?, playtime=?, publicDate=?, logo=? where detailURL=?'
};

module.exports = sql;
