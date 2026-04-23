const pool = require("../config/db");

const createPost = async (req, res) => {
    try {
        const { title, content, user_id } = req.body;
        const newPost = await pool.query(
            "INSERT INTO posts (title, content, user_id) VALUES ($1, $2, $3) RETURNING *",
            [title, content, user_id]
        );
        res.status(201).json(newPost.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
    }
};

const getAllPosts = async (req, res) => {
    try {
        const allPosts = await pool.query(
            "SELECT posts.id, posts.title, posts.content, posts.created_at, users.username FROM posts JOIN users ON posts.user_id = users.id ORDER BY posts.created_at DESC"
        );
        res.json(allPosts.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
    }
};

module.exports = {
    createPost,
    getAllPosts
};
