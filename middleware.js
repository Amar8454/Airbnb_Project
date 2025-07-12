const dataList = require("./models/data");
const Review = require("./models/review");
const Errorhandle = require("./utils/Errorhandle");

module.exports.isAunthenticated = (req, res, next) => {
  // console.log(req.path, " ", req.originalUrl);
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", " You must be logged in to create listing.");
    res.redirect("/login");
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let datalist = await dataList.findById(id);
  if (!datalist.owner.equals(res.locals.CurrUser._id)) {
    req.flash("error", "You are not owner of this listing.");
    return res.redirect(`/datalist/${id}`);
  }
  next();
};

module.exports.isAuthor = async (req, res, next) => {
  let { id, reviewId } = req.params;
  let review = await Review.findById(reviewId);
  if (!review.author.equals(res.locals.CurrUser._id)) {
    req.flash("error", "You are not author of this listing.");
    return res.redirect(`/datalist/${id}`);
  }
  next();
};

module.exports.validationDatalist = (req, res, next) => {
  let { error } = datalistSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(" ,");
    throw new Errorhandle(400, errMsg);
  } else {
    next();
  }
};
