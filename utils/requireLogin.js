var requireLogin = function (req, res, next) {
  if (!req.user) {
    console.log("REQUIRE LOGIN ", req.user);
    res.redirect('/auth');
  } else {
    next();
  }
};

module.exports = {
  requireLogin
};
