const express = require("express");
const passport = require("passport");

const router = express.Router();

// Route to initiate GitHub authentication
router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));

// Callback route after GitHub authentication
router.get("/github/callback",
    passport.authenticate("github", { failureRedirect: "/" }),
    (req, res) => {
        res.redirect("/api-docs");
    }
);

// Protected route (only accessible after login)
router.get("/dashboard", (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect("/");
    }
    res.send(`<h1>Welcome ${req.user.username}</h1><img src="${req.user.avatar}" width="100"><br><a href="/auth/logout">Logout</a>`);
});

// Logout route
router.get("/logout", (req, res, next) => {
    req.logout(err => {
        if (err) return next(err);
        res.redirect("/");
    });
});

module.exports = router;
