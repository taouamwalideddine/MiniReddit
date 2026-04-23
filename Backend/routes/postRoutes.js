const express = require("express");
const router = express.Router();
const { createPost, getAllPosts, getPostById, updatePost, deletePost, votePost, getPostsByUser } = require("../controllers/postController");

router.post("/", createPost);
router.get("/", getAllPosts);
router.get("/user/:username", getPostsByUser);
router.get("/:id", getPostById);
router.put("/:id", updatePost);
router.delete("/:id", deletePost);
router.post("/:id/vote", votePost);

module.exports = router;
