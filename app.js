if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const Errorhandle = require("./utils/Errorhandle");
const User = require("./models/user");
const ejsMate = require("ejs-mate");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const app = express();

const listingRoutes = require("./routes/listing");
const reviewRoutes = require("./routes/review");
const userRoutes = require("./routes/user");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

// let MongoDB_URL = "mongodb://127.0.0.1:27017/wonderlust";
let MongoDB_Atlas = process.env.MongoDB_URL;

main()
  .then(() => {
    console.log("mongodb connected");
  })
  .catch((err) => console.log(err));
async function main() {
  await mongoose.connect(MongoDB_Atlas);
}

let PORT = 8080;

// mongosotre
const store = MongoStore.create({
  mongoUrl: MongoDB_Atlas,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

store.on("error", () => {
  console.log("error in mongo-session store", err);
});

const sessionExression = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
};

app.use(session(sessionExression));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.CurrUser = req.user;
  next();
});

// routes
app.use("/datalist", listingRoutes);
app.use("/datalist/:id/review", reviewRoutes);
app.use("/", userRoutes);

// mongooseMiddleware
app.all("*", (req, res, next) => {
  next(new Errorhandle(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
  let { status = 401, message = "Something Error" } = err;
  res.render("./datalist/error.ejs", { err });
});

app.listen(PORT, (req, res) => {
  console.log(`server is running on ${PORT}`);
});

// app.get("/signup", async (req, res) => {
//   let NewUser = new User({
//     username: "Amarjit-109",
//     email: "amarjit@gmail.com",
//   });
//   const result = await User.register(NewUser, "Hello");
//   res.send(NewUser);
//   console.log(result);
// });
