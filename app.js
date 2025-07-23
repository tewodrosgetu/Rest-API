const express = require("express");
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
const feedRoutes = require("./routes/feed");

const app = express();
app.use(bodyparser.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Method", "GET,POST,PATCH,PUT,DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  next();
});
app.use("/feed", feedRoutes);
mongoose
  .connect("mongodb://127.0.0.1:27017/message")
  .then((result) => {
    app.listen(5000);
  })
  .catch((eerr) => console.log(err));
