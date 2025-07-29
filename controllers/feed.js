const { validationResult } = require("express-validator");
const fs = require("fs");
const path = require("path");
const Post = require("../models/post");
const User = require("../models/user");
exports.getPosts = async (req, res, next) => {
  const currentpage = req.query.page || 1;
  const perPage = 2;
  try {
    const totalItems = await Post.find().countDocuments();
    const posts = await Post.find()
      .skip((currentpage - 1) * perPage)
      .limit(perPage);

    res.status(200).json({
      message: "poste fecthed successfuly",
      posts: posts,
      totalItems: totalItems,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.status = 500;
    }
    next(err);
  }
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
  const imageUrl = req.file.path.replace("\\", "/");
  const title = req.body.title;
  let creator;
  const content = req.body.content;
  const post = new Post({
    title: title,
    content: content,
    imageUrl: imageUrl,
    creator: req.userId,
  });
  post
    .save()
    .then((result) => {
      return User.findById(req.userId);
    })
    .then((user) => {
      creator = user;
      user.posts.push(post);
      return user.save();
    })
    .then((result) => {
      res.status(201).json({
        message: "post created successfuly!",
        post: post,
        creator: { _id: creator._id, name: creator.name },
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
exports.updatePost = (req, res, next) => {
  const postId = req.params.postId;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("validation is failed ,entered incorrecte data");
    error.statusCode = 422;
    throw error;
  }
  const title = req.body.title;
  const content = req.body.content;
  let imageUrl = req.body.image;

  if (req.file) {
    imageUrl = req.file.path.replace("\\", "/");
  }

  if (!imageUrl) {
    const error = new Error("image file not selected");
    error.statusCode = 422;
    throw error;
  }
  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error("not find the post");
        error.statusCode = 404;
        throw error;
      }
      if (post.creator.toString() !== req.userId) {
        const error = new Error("not authorized");
        error.statusCode = 403;
        throw error;
      }
      if (imageUrl !== post.imageUrl) {
        clearImage(post.imageUrl);
      }
      post.title = title;
      post.content = content;
      post.imageUrl = imageUrl;
      return post.save();
    })
    .then((result) => {
      res.status(200).json({ message: "updated the product", post: result });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.status = 500;
      }
      next(err);
    });
};
exports.deletePost = (req, res, next) => {
  const postId = req.params.postId;
  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error("not find the post");
        error.statusCode = 404;
        throw error;
      }
      //check the use logged
      if (post.creator.toString() !== req.userId) {
        const error = new Error("not authorized");
        error.statusCode = 403;
        throw error;
      }
      clearImage(post.imageUrl);
      return Post.findByIdAndDelete(postId);
    })
    .then((result) => {
      return User.findById(req.userId);
    })
    .then((user) => {
      user.posts.pull(postId);
      return user.save();
    })
    .then((result) => {
      res.status(200).json({ message: "deleted sucessful" });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.status = 500;
      }
      next(err);
    });
};
const clearImage = (filePath) => {
  deletefile = path.join(__dirname, "..", filePath);
  fs.unlink(deletefile, (err) => {
    console.log(err);
  });
};
