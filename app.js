const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const multer = require("multer");
const bodyparser = require("body-parser");
const feedRoutes = require("./routes/feed");
const authRoutes = require("./routes/auth");

const filestorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      new Date().toISOString().replace(/:/g, "-") + "-" + file.originalname
    );
  },
});
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const app = express();
app.use(bodyparser.json());
app.use(
  multer({ storage: filestorage, fileFilter: fileFilter }).single("image")
);

app.use("/images", express.static(path.join(__dirname, "images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Method", "GET,POST,PATCH,PUT,DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  next();
});

app.use("/feed", feedRoutes);
app.use("/auth", authRoutes);

app.use((error, req, res, next) => {
  const status = error.statusCode;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});
mongoose
  .connect("mongodb://127.0.0.1:27017/message")
  .then((result) => {
    const server = app.listen(5000);
    console.log("mogodb connected connected");
    const io = require("./socket").init(server);
    io.on("connection", (socket) => {});
    console.log("client connected");
  })
  .catch((err) => console.log(err));
