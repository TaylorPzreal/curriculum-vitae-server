const sql = {
  insert: 'insert into idea(detail, uname, ulogo, uid) value(?, ?, ?, ?)',
  queryMore: 'select * from idea order by ctime desc limit 15 offset ?',
  changeCollection: 'update idea set collection=? where id=?'
};
module.exports = sql;
