const mongoose = require("mongoose");
const Review = require("./review");

const dataSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  image: {
    url: String,
    filename: String,
  },
  price: {
    type: Number,
  },
  location: {
    type: String,
  },
  country: {
    type: String,
  },
  review: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  geometry: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
});

dataSchema.post("findOneAndDelete", async (datalist) => {
  if (datalist) {
    await Review.deleteMany({ _id: { $in: datalist.review } });
  }
});

const dataList = mongoose.model("dataList", dataSchema);
module.exports = dataList;
