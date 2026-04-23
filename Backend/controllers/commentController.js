const pool = require("../config/db");

const createComment = async (req, res) => {
    try {
        const { content, post_id, user_id } = req.body;
        const newComment = await pool.query(
            "INSERT INTO comments (content, post_id, user_id) VALUES ($1, $2, $3) RETURNING *",
            [content, post_id, user_id]
        );
        res.status(201).json(newComment.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
    }
};

const getCommentsByPost = async (req, res) => {
    try {
        const { post_id } = req.params;
        const comments = await pool.query(
            "SELECT comments.id, comments.content, comments.created_at, users.username FROM comments JOIN users ON comments.user_id = users.id WHERE comments.post_id = $1 ORDER BY comments.created_at ASC",
            [post_id]
        );
        res.json(comments.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
    }
};

module.exports = {
    createComment,
    getCommentsByPost
};
