const User = require("../models/user");

module.exports.SignUpPage = async (req, res, next) => {
  try {
    let { email, username, password } = req.body;
    const newUser = new User({ email, username });
    const registerUser = await User.register(newUser, password);
    req.login(registerUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome to Page");
      res.redirect("/datalist");
    });
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/signup");
  }
};

module.exports.LoginPage = async (req, res) => {
  req.flash("success", "Welcome to wonderlust!");
  let redirectUrl = res.locals.redirectUrl || "/datalist";
  res.redirect(redirectUrl);
};

module.exports.LogOutPage = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "you logged out!");
    res.redirect("/datalist");
  });
};

module.exports.RenderSignupForm = (req, res) => {
  res.render("./UserPage/signup");
};

module.exports.RenderLoginFrom = (req, res) => {
  res.render("./UserPage/login");
};
