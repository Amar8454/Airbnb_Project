const dataList = require("../models/data");
const Review = require("../models/review");

module.exports.ReviewDelete = async (req, res) => {
  let { id, reviewId } = req.params;
  await dataList.findByIdAndUpdate(id, { $pull: { review: reviewId } });
  req.flash("success", "Reviews Successfully Delete.");
  await Review.findByIdAndDelete(id);
  res.redirect(`/datalist/${id}`);
};

module.exports.ReviewPost = async (req, res) => {
  let datalist = await dataList.findById(req.params.id);
  let newReview = new Review(req.body.review);
  newReview.author = req.user._id;
  datalist.review.push(newReview);
  await newReview.save();
  await datalist.save();
  req.flash("success", "Reviews Successfully Add.");
  res.redirect(`/datalist/${datalist.id}`);
};
