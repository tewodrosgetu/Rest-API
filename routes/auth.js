const express = require("express");
const { body } = require("express-validator");
const User = require("../models/user");
const authController = require("../controllers/auth");
const isAuth = require("../middleware/is-auth");
const router = express.Router();

router.put(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("plaese enter valid email.")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject("email already exist");
          }
        });
      })
      .normalizeEmail(),
    body("password").trim().isLength({ min: 5 }),
    body("name").trim().not().isEmpty(),
  ],
  authController.signUp
);
router.post("/login", authController.login);
router.get("/status", isAuth, authController.getUserStatus);
router.put(
  "/status",
  isAuth,
  [body("status").trim().not().isEmpty()],
  authController.upDateUserStatus
);

module.exports = router;
