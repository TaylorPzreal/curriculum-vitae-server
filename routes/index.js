const express = require('express');
const app = express();

// app.use('/', require('./index'));
app.use('/users', require('./users'));
app.use('/crawler', require('./crawler'));
app.use('/blog', require('./blog'));
app.use('/movie', require('./movie'));
app.use('/account', require('./account'));
app.use('/upload', require('./upload'));
app.use('/mail', require('./mail'));
app.use('/idea', require('./idea'));
app.use('/signup', require('./signup'));
app.use('/login', require('./login'));
// app.use('/auth', require('./src/auth'));

module.exports = app;
