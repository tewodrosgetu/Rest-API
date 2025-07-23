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
  const title = req.body.title;
  const content = req.body.content;
  res.status(201).json({
    message: "post created successfuly!",
    post: { id: new Date().toISOString(), title: title, content: content },
  });
};
