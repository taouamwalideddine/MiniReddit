const express = require("express");
const router = express.Router();
const { createComment, getCommentsByPost } = require("../controllers/commentController");

router.post("/", createComment);
router.get("/:post_id", getCommentsByPost);

module.exports = router;
