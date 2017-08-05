const sql = {
  insert: 'insert into idea(detail, uname, ulogo, uid) value(?, ?, ?, ?)',
  queryMore: 'select * from idea limit 15 offset ?',
  changeCollection: 'update idea set collection=? where id=?'
};
module.exports = sql;
