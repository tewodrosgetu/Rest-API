const { validationResult } = require("express-validator");
const Post = require("../models/post");
exports.getPosts = (req, res, next) => {
  Post.find()
    .then((posts) => {
      res.status(200).json({
        posts: posts,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.status = 500;
      }
      next(err);
    });
};
exports.postPost = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error("validation is failed ,entered incorrecte data");
    error.statusCode = 422;
    throw error;
  }
  if (!req.file) {
    const error = new Error("image not provided");
    error.statusCode = 422;
    throw error;
  }
  const imageUrl = req.file.path;
  const title = req.body.title;
  const content = req.body.content;
  const post = new Post({
    title: title,
    content: content,
    imageUrl: imageUrl,
    creator: { name: "teda" },
  });
  post
    .save()
    .then((post) => {
      res.status(201).json({
        message: "post created successfuly!",
        post: post,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.status = 500;
      }
      next(err);
    });
};
exports.getpost = (req, res, next) => {
  const postId = req.params.postId;
  Post.findById(postId)
    .then((post) => {
      res.status(200).json({
        post: post,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.status = 500;
      }
      next(err);
    });
};
