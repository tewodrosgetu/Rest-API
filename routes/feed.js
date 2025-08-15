const express = require("express");
const feedController = require("../controllers/feed");
const isAuth = require("../middleware/is-auth");
const { body } = require("express-validator");

const router = express.Router();

router.get("/posts", isAuth, feedController.getPosts);
router.post(
  "/post",
  isAuth,
  [
    body("title").trim().isLength({ min: 5 }),
    body("content").trim().isLength({ min: 5 }),
  ],
  feedController.postPost
);
router.get("/post/:postId", isAuth, feedController.getpost);
router.put(
  "/post/:postId",
  isAuth,
  [
    body("title").trim().isLength({ min: 5 }),
    body("content").trim().isLength({ min: 5 }),
  ],
  feedController.updatePost
);
router.delete("/post/:postId", isAuth, feedController.deletePost);

module.exports = router;
