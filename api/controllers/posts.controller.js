const db = require("../connect");
const jwt = require("jsonwebtoken");
const moment = require("moment");

const getPosts = (req, res) => {
  const cat = req.query.category;
  q =
    cat !== undefined
      ? "SELECT * FROM posts WHERE posts.category = ? AND posts.id != ? ORDER BY posts.createdAt DESC"
      : "SELECT * FROM posts ORDER BY posts.createdAt DESC";
  const values = cat !== undefined ? [req.query.category, req.query.id] : [];
  db.query(q, values, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

const addPost = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("You are not logged in");
  jwt.verify(token, process.env.SECRET_KEY, (err, userInfo) => {
    if (err) return res.status(403).json("token is invalid");
    const q =
      "INSERT INTO posts (`userId`, `img`, `desc`, `title`, `category`, `createdAt`) VALUES (?)";
    const values = [
      userInfo.id,
      req.body.img,
      req.body.desc,
      req.body.title,
      req.body.category,
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
    ];
    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Post has been created");
    });
  });
};

const getPost = (req, res) => {
  const q =
    "SELECT posts.*, profilePic, username FROM posts JOIN users ON (posts.userId = users.id) WHERE posts.id = ?";
  db.query(q, [req.params.id], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

const updatePost = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("You are not logged in");
  jwt.verify(token, process.env.SECRET_KEY, (err, userInfo) => {
    if (err) return res.status(403).json("token is invalid");
    const q =
      "UPDATE posts SET `img`=?, `desc`=?, `title`=?, `category`=? WHERE posts.userId = ? AND posts.id = ?";

    db.query(
      q,
      [
        req.body.img,
        req.body.desc,
        req.body.title,
        req.body.category,
        userInfo.id,
        req.params.id,
      ],
      (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json("Post has been updated");
      }
    );
  });
};

const deletePost = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("You are not logged in");
  jwt.verify(token, process.env.SECRET_KEY, (err, userInfo) => {
    if (err) return res.status(403).json("token is invalid");
    const q = "DELETE FROM posts  WHERE posts.userId = ? AND posts.id = ?";

    db.query(q, [userInfo.id, req.params.id], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Post has been deleted");
    });
  });
};

module.exports = { getPosts, addPost, getPost, updatePost, deletePost };
