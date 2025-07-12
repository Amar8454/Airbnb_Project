const dataList = require("../models/data");

const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.AllDatalist = (req, res) => {
  res.render("./Datalist/new");
};

module.exports.CreatePost = async (req, res, next) => {
  let response = await geocodingClient
    .forwardGeocode({
      query: req.body.datalist.location,
      limit: 1,
    })
    .send();
  let url = req.file.path;
  let filename = req.file.filename;
  let newDatalist = new dataList(req.body.datalist);
  newDatalist.owner = req.user._id;
  newDatalist.image = { url, filename };
  newDatalist.geometry = response.body.features[0].geometry;
  let savedDatalist = await newDatalist.save();
  req.flash("success", "New list Successfully Created.");
  req.isAuthenticated();
  res.redirect("/datalist");
};

module.exports.index = async (req, res) => {
  let allData = await dataList.find();
  res.render("./Datalist/allPost", { allData });
};

module.exports.EditPage = async (req, res) => {
  let { id } = req.params;
  let editDatalist = await dataList.findById(id);
  if (!editDatalist) {
    req.flash("error", "listing does not existing .");
    res.redirect("/datalist");
  }
  let originalImageUrl = editDatalist.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
  res.render("./Datalist/edit", { editDatalist, originalImageUrl });
};

module.exports.UpdatePage = async (req, res) => {
  let { id } = req.params;
  let updateList = await dataList.findByIdAndUpdate(id, {
    ...req.body.datalist,
  });

  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    updateList.image = { url, filename };
    await updateList.save();
  }

  req.flash("success", "list Successfully Updated.");
  res.redirect(`/datalist/${id}`);
};

module.exports.ShowPage = async (req, res) => {
  let { id } = req.params;
  let showData = await dataList
    .findById(id)
    .populate({
      path: "review",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!showData) {
    req.flash("error", "listing does not existing.");
    res.redirect("/datalist");
  }
  res.render("./Datalist/show.ejs", { showData });
};

module.exports.DeleteRoutes = async (req, res) => {
  let { id } = req.params;
  let deleteData = await dataList.findByIdAndDelete(id);
  req.flash("success", "list Successfully Deleted.");
  res.redirect("/datalist");
};
