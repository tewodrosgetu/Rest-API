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
exports.postPost = async (req, res, next) => {
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
  const content = req.body.content;
  const post = new Post({
    title: title,
    content: content,
    imageUrl: imageUrl,
    creator: req.userId,
  });
  await post.save();
  try {
    const user = await User.findById(req.userId);

    user.posts.push(post);
    await user.save();

    res.status(201).json({
      message: "post created successfuly!",
      post: post,
      creator: { _id: user._id, name: user.name },
    });
  } catch (err) {
    if (!err.statusCode) {
      err.status = 500;
    }
    next(err);
  }
};
exports.getpost = async (req, res, next) => {
  const postId = req.params.postId;
  try {
    const post = await Post.findById(postId);
    res.status(200).json({
      post: post,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.status = 500;
    }
    next(err);
  }
};
exports.updatePost = async (req, res, next) => {
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
  try {
    const post = await Post.findById(postId);

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
    const result = await post.save();

    res.status(200).json({ message: "updated the product", post: result });
  } catch (err) {
    if (!err.statusCode) {
      err.status = 500;
    }
    next(err);
  }
};
exports.deletePost = async (req, res, next) => {
  const postId = req.params.postId;
  try {
    const post = await Post.findById(postId);

    if (!post) {
      const error = new Error("not find the post");
      error.statusCode = 404;
      throw error;
    }
    //check the user logged
    if (post.creator.toString() !== req.userId) {
      const error = new Error("not authorized");
      error.statusCode = 403;
      throw error;
    }
    clearImage(post.imageUrl);
    await Post.findByIdAndDelete(postId);

    const user = await User.findById(req.userId);

    user.posts.pull(postId);
    await user.save();

    res.status(200).json({ message: "deleted sucessful" });
  } catch (err) {
    if (!err.statusCode) {
      err.status = 500;
    }
    next(err);
  }
};
const clearImage = (filePath) => {
  deletefile = path.join(__dirname, "..", filePath);
  fs.unlink(deletefile, (err) => {
    console.log(err);
  });
};
