// File app.js (hoặc index.js)
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");

const userRouter = require("./routes/user");
const postsRouter = require("./routes/posts");
const reactionRouter = require("./routes/reaction");
const messageRouter = require("./routes/message");

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

mongoose
  .connect(
    "mongodb+srv://api-sweets:api-sweets@api-sweets.pden2j8.mongodb.net/sweets",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log(">>>>>>>>>> DB Connected!!!!!!"));

app.use("/user", userRouter);
app.use("/posts", postsRouter);
app.use("/reaction", reactionRouter);
app.use("/message", messageRouter);

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
