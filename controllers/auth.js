const bcrypt = require ('bcryptjs');

const User = require ('../models/user');

exports.getLogin = (req, res) => {
  let message = req.flash ('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render ('auth/login', {
    pageTitle: 'Login',
    path: '/login',
    errorMessage: message,
  });
};

exports.postLogin = (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne ({email})
    .then (user => {
      if (!user) {
        req.flash ('error', 'Invalid email or password');
        return res.redirect ('/login');
      }
      bcrypt
        .compare (password, user.password)
        .then (doMatch => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save (() => {
              res.redirect ('/');
            });
          }
          req.flash ('error', 'Invalid email or password');
          res.redirect ('/login');
        })
        .catch (err => {
          res.redirect ('/login');
        });
    })
    .catch (err => {
      console.log (err);
    });
};

exports.getSignup = (req, res) => {
  let message = req.flash ('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render ('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    errorMessage: message,
  });
};

exports.postSignup = (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  User.findOne ({email})
    .then (userDoc => {
      if (userDoc) {
        req.flash ('error', 'Email already taken');
        return res.redirect ('/signup');
      }
      return bcrypt
        .hash (password, 12)
        .then (hashedPassword => {
          const user = new User ({
            email,
            password: hashedPassword,
            cart: {items: []},
          });
          return user.save ();
        })
        .then (result => {
          res.redirect ('/login');
        });
    })
    .catch (err => console.log (err));
};

exports.postLogout = (req, res) => {
  req.session.destroy (() => {
    res.redirect ('/');
  });
};
