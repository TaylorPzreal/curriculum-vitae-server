const express = require('express');
const app = express();

app.use('/auth', require('./auth'));
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

module.exports = app;
