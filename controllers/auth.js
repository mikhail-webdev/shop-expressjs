const User = require ('../models/user');

exports.getLogin = (req, res) => {
  const isLoggedIn = req.get ('Cookie').trim ().split ('=')[1];
  res.render ('auth/login', {
    pageTitle: 'Login',
    path: '/login',
    isAuthenticated: false,
  });
};

exports.postLogin = (req, res) => {
  User.findById ('605b973385896e1fc6c44255')
    .then (user => {
      req.session.isLoggedIn = true;
      req.session.user = user;
      req.session.save (() => {
        res.redirect ('/');
      });
    })
    .catch (err => {
      console.log (err);
    });
};

exports.postLogout = (req, res) => {
  req.session.destroy (() => {
    res.redirect ('/');
  });
};
