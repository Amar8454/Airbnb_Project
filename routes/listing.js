const express = require("express");
const router = express.Router();
const WrapAsync = require("../utils/WrapError");
const multer = require("multer");
const listingControllers = require("../controllers/listing.js");
const { isAunthenticated, isOwner } = require("../middleware.js");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

router.get("/new", isAunthenticated, listingControllers.AllDatalist);

router
  .route("/")
  .get(WrapAsync(listingControllers.index))
  .post(
    isAunthenticated,
    upload.single("datalist[image]"),
    WrapAsync(listingControllers.CreatePost)
  );

router.get(
  "/:id/edit",
  isAunthenticated,
  isOwner,
  WrapAsync(listingControllers.EditPage)
);

router
  .route("/:id")
  .get(WrapAsync(listingControllers.ShowPage))
  //isAunthenticated,
  .put(
    isAunthenticated,
    isOwner,
    upload.single("datalist[image]"),
    WrapAsync(listingControllers.UpdatePage)
  )
  .delete(
    isAunthenticated,
    isOwner,
    WrapAsync(listingControllers.DeleteRoutes)
  );

module.exports = router;
