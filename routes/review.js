const express = require("express");
const router = express.Router({ mergeParams: true });
const WrapAsync = require("../utils/WrapError");
const Errorhandle = require("../utils/Errorhandle");
const { reviewSchema } = require("../schemaJoi");
const { isAunthenticated, isAuthor } = require("../middleware");
const reviewListing = require("../controllers/reviews");

const validationReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(" ,");
    throw new Errorhandle(400, errMsg);
  } else {
    next();
  }
};

// delete review routes
router.delete(
  "/:reviewId",
  isAunthenticated,
  isAuthor,
  WrapAsync(reviewListing.ReviewDelete)
);

// post review routes
router.post(
  "/",
  isAunthenticated,
  validationReview,
  WrapAsync(reviewListing.ReviewPost)
);

module.exports = router;
