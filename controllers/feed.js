const { validationResult } = require("express-validator");
const Post = require("../models/post");
exports.getPost = (req, res, next) => {
  res.status(200).json({
    posts: [
      {
        _id: "1",
        title: "first",
        content: "first book writen",
        imageUrl: "images/feqerte.png",
        creator: {
          name: "teda",
        },
        createdAt: new Date(),
      },
    ],
  });
};
exports.postPost = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: "validation is failed ,entered incorrecte data",
      errors: errors.array(),
    });
  }
  const title = req.body.title;
  const content = req.body.content;
  const post = new Post({
    title: title,
    content: content,
    imageUrl: "images/feqerte.png",
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
    .catch((err) => console.log(err));
};
