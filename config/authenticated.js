// validate authenticated
module.exports = function authenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.json({
    code: 9999,
    data: null,
    msg: 'no authenticated'
  });
}
