exports.get404 = (req, res) => {
  res.status (404).render ('404', {
    pageTitle: '404 Not Found',
    path: '/404',
    isAuthenticated: req.session.isLoggedIn,
  });
};

exports.get500 = (req, res) => {
  res.status (500).render ('500', {
    pageTitle: '500 Something went wrong',
    path: '/500',
    isAuthenticated: req.session.isLoggedIn,
  });
};
