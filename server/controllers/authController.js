const mongoose = require('mongoose');
const User = mongoose.model('User');
const passport = require('passport');

exports.validateSignup = (req, res, next) => {
  req.sanitizeBody('name');
  req.sanitizeBody('email');
  req.sanitizeBody('password');
  console.log("validateSignup 1");
  // Name is not null and is 4 to 10 chars
  req.checkBody('name', 'Enter a name').notEmpty();
  req.checkBody('name', 'Name must be between 4 to 10 chars')
    .isLength({ min: 4, max: 10 });
  console.log("validateSignup 2");
  // Email is not null, valid and normalized
  req.checkBody('email', 'Enter a valid email')
    .isEmail()
    .normalizeEmail();
  console.log("validateSignup 3");
  req.checkBody('password', 'Enter a password').notEmpty();
  req.checkBody('password', 'Password must be between 4 and 10 chars')
    .isLength({ min: 4, max: 10 });
  console.log("validateSignup 4");
  const errors = req.validationErrors();
  if (errors) {
    console.log("validateSignup err");
    const firstError = errors.map(error => error.msg)[0];
    return res.status(400).send(firstError);
  }
  console.log("validateSignup 5");
  next();
};

exports.signup = async (req, res) => {
  console.log("signup 1");
  const { name, email, password } = req.body;
  console.log("signup 2");
  console.log('name: ', name, ', email: ', email, ', password: ', password);
  let user;
  try {
    user = await new User({ name, email, password });
  } catch (err) {
    console.log(err);
  }
  console.log("signup 3");
  await User.register(user, password, (err, user) => {
    console.log("signup 4");
    console.log('user: ', user);
    console.log('err: ', err);
    if (err) {
      console.log("signup err");
      return res.status(501).send(err.stack);
    }
    console.log("signup 5");
    res.json(user);
  });
};

exports.signin = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return res.status(500).json(err.message);
    }
    if (!user) {
      return res.status(400).json(info.message);
    }
    req.login(user, err => {
      if (err) {
        return res.status(500).json(err.message);
      }
      res.json(user);
    })
  })(req, res, next);
};

exports.signout = () => { };

exports.checkAuth = () => { };
