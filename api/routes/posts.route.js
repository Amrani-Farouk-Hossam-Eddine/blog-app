const express = require("express");
const router = express.Router();
const {
  getPosts,
  addPost,
  getPost,
  updatePost,
  deletePost,
} = require("../controllers/posts.controller");

router.get("/", getPosts);
router.post("/", addPost);
router.get("/single/:id", getPost);
router.put("/:id", updatePost);
router.delete("/:id", deletePost);

module.exports = router;
