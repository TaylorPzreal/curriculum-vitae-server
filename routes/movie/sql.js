const sql = {
  queryById: '',
  queryByPage: 'SELECT * FROM movie LIMIT 10 offset ?',
  queryTopMovie: 'select * from movie where country="美国" order by year desc limit 5'
};

module.exports = sql;
