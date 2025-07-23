exports.getPost = (req, res, next) => {
  res
    .status(200)
    .json({ posts: [{ title: "first", content: "first book writen" }] });
};
exports.postPost = (req, res, next) => {
  const title = req.body.title;
  const content = req.body.content;
  res.status(201).json({
    message: "post created successfuly!",
    post: { id: new Date().toISOString(), title: title, content: content },
  });
};
