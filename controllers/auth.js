const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.signUp = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("validation error");
    error.statuseCode = 422;
    error.data = errors.array();
    throw error;
  }
  const email = req.body.email;
  const password = req.body.password;
  const name = req.body.name;
  try {
    const hashpassword = await bcrypt.hash(password, 12);
    const user = new User({
      name: name,
      email: email,
      password: hashpassword,
    });
    const result = await user.save();
    res.status(201).json({ message: "user created", userId: result._id });
  } catch (err) {
    if (!err.statusCode) {
      err.status = 500;
    }
    next(err);
  }
};
exports.login = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let loadesuser;
  try {
    const user = await User.findOne({ email: email });
    loadesuser = user;
    if (!user) {
      const error = new Error("user not found");
      error.statuseCode = 401;
      throw error;
    }
    const equal = await bcrypt.compare(password, user.password);

    if (!equal) {
      const error = new Error("password not correct");
      error.statuseCode = 401;
      throw error;
    }

    const token = jwt.sign(
      {
        email: loadesuser.email,
        userId: loadesuser._id.toString(),
      },
      "teda1221kal",
      { expiresIn: "1h" }
    );
    res.status(200).json({ token: token, userId: loadesuser._id.toString() });
  } catch (err) {
    if (!err.statusCode) {
      err.status = 500;
    }
    next(err);
  }
};
exports.getUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      const error = new Error("user not found");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({ status: user.status });
  } catch (err) {
    if (!err.statusCode) {
      err.status = 500;
    }
    next(err);
  }
};
exports.upDateUserStatus = async (req, res, next) => {
  const newStatus = req.body.status;
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      const error = new Error("user not found");
      error.statusCode = 404;
      throw error;
    }
    user.status = newStatus;
    await user.save();
    res.status(200).json({ message: "updated the status" });
  } catch (err) {
    if (!err.statusCode) {
      err.status = 500;
    }
    next(err);
  }
};
