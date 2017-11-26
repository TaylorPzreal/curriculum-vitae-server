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
    type: Sequelize.STRING(50),
  },
  name: Sequelize.STRING(100),
  password: Sequelize.STRING(45),
  email: Sequelize.STRING(45),
  gender: Sequelize.INTEGER(4),
  birth: Sequelize.STRING(10),
  createdAt: Sequelize.BIGINT(13),
  updatedAt: Sequelize.BIGINT(13),
  version: Sequelize.INTEGER(3)
}, {
  timestamps: false
});

passport.use(new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password'
}, (username, password, done) => {
  AccountModel.findOne({
    where: {
      username
    }
  }).then((res) => {
    const result = res.dataValues;

    if (result !== null) {
      if (result.password === password) {
        return done(null, result);
      } else {
        return done(null, false, 'Password false.')
      }
    } else {
      return done(null, false, 'Username not found.')
    }
  }).catch((err) => {
    console.error(err);
    return done(null, false, {
      message: err
    });
  });
}));

// 用户登录成功以后，把用户uid存储到session中
passport.serializeUser((user, done) => {
  done(null, user.uid);
});

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

    done(null, user);
  } catch(err) {
    done(err);
  }
});

module.exports = passport;
