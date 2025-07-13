const express = require("express");
const router = express.Router();
const passport = require("passport");
const WrapError = require("../utils/WrapError.js");
const { saveRedirectUrl } = require("../middleware.js");
const UserListing = require("../controllers/user.js");

router
  .route("/login")
  .get(UserListing.RenderLoginFrom)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    UserListing.LoginPage
  );

router
  .route("/signup")
  .get(UserListing.RenderSignupForm)
  .post(WrapError(UserListing.SignUpPage));

router.get("/logout", UserListing.LogOutPage);
module.exports = router;
