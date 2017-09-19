const sql = {
  insert: 'INSERT INTO user(name, email, password) VALUES(?, ?, ?)',
  queryByName: 'select * from user where name=?',
  queryByEmail: 'select * from user where email=?'
};
module.exports = sql;
