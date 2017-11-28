const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const Sequelize = require('sequelize');
const SequelizeInstance = require('./sequelize');

const sequelize = SequelizeInstance();
sequelize.authenticate().then(() => {
  console.warn('Connect database has been established successfully');
}).catch((err) => {
  console.error('Unable to connect to the database: ', err);
});

const AccountModel = sequelize.define('user', {
  uid: {
    type: Sequelize.INTEGER(11),
  },
  name: Sequelize.STRING(16),
  password: Sequelize.STRING(45),
  email: Sequelize.STRING(45),
  gender: Sequelize.BOOLEAN,
  birth: Sequelize.BIGINT,
  create_time: Sequelize.BIGINT(13),
  update_time: Sequelize.BIGINT(13)
}, {
  timestamps: false
});

passport.use('local-login', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, (email, password, done) => {
  AccountModel.findOne({
    where: {
      email: email
    }
  }).then((res) => {
    if (res && res.dataValues) {
      const user = res.dataValues;
      if (user.password === password) {
        delete user.password; // don't transfer password
        return done(null, user);
      } else {
        return done(null, false, 'Password wrong');
      }
    } else {
      return done(null, false, 'Email not found');
    }
  }).catch((err) => {
    console.error(err);
    return done(err);
  });
}));

// 用户登录成功以后，把用户uid存储到（序列化）session中
passport.serializeUser((user, done) => {
  done(null, user.uid);
});

// 从session反序列化，若存在，则从数据库中取出数据，并存储到 req.user 中
passport.deserializeUser(async (uid, done) => {
  try {
    let user;
    await AccountModel.findOne({
      where: {
        uid: uid
      }
    }).then((res) => {
      user = res.dataValues;
    });

    delete user.password; // Don't transfer password
    done(null, user);
  } catch(err) {
    done(err);
  }
});

module.exports = passport;
