const sql = {
  'saveUser': 'INSERT INTO user(id,name,email,location,age,company,logo,bio,github_website,blog_website, followers, following) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)',
  'queryUserById': 'select * from user where id=?',
  'updateUserById': 'UPDATE user set name=?, email=?, location=?, age=?,company=?,logo=?,bio=?, followers=?, following=? where id=?'
};

module.exports = sql;
