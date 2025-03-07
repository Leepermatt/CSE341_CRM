module.exports = function (req, res, next) {
    if (!req.isAuthenticated()) {
      // Redirect to GitHub login if the user is not authenticated
      return res.redirect("/auth/github");
    }
    next(); // Proceed to the next middleware or route handler if authenticated
  };
  