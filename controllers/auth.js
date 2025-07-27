const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const User = require("../models/user");

exports.signUp = (req, res, next) => {
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
  bcrypt
    .hash(password, 12)
    .then((hashpassword) => {
      const user = new User({
        name: name,
        email: email,
        password: hashpassword,
      });
      return user.save();
    })
    .then((result) => {
      res.status(201).json({ message: "user created", userId: result._id });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.status = 500;
      }
      next(err);
    });
};
