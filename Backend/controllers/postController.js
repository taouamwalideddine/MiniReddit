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
            "SELECT posts.id, posts.title, posts.content, posts.created_at, posts.user_id, users.username FROM posts JOIN users ON posts.user_id = users.id ORDER BY posts.created_at DESC"
        );
        res.json(allPosts.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
    }
};

const getPostById = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await pool.query(
            "SELECT posts.id, posts.title, posts.content, posts.created_at, posts.user_id, users.username FROM posts JOIN users ON posts.user_id = users.id WHERE posts.id = $1",
            [id]
        );
        if (post.rows.length === 0) return res.status(404).json({ error: "Post not found" });
        res.json(post.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
    }
};

const deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedPost = await pool.query("DELETE FROM posts WHERE id = $1 RETURNING *", [id]);
        if (deletedPost.rows.length === 0) return res.status(404).json({ error: "Post not found" });
        res.json({ message: "Post deleted successfully" });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
    }
};

const updatePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content } = req.body;
        const updatedPost = await pool.query(
            "UPDATE posts SET title = $1, content = $2 WHERE id = $3 RETURNING *",
            [title, content, id]
        );
        if (updatedPost.rows.length === 0) return res.status(404).json({ error: "Post not found" });
        res.json(updatedPost.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
    }
};

module.exports = {
    createPost,
    getAllPosts,
    getPostById,
    updatePost,
    deletePost
};
