function checkNotAuth(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/dashboard");
  }
  next();
}

module.exports = checkNotAuth;
