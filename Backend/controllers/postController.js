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
            `SELECT posts.id, posts.title, posts.content, posts.created_at, posts.user_id, users.username, 
            COALESCE(SUM(post_votes.vote_type), 0) as score 
            FROM posts 
            JOIN users ON posts.user_id = users.id 
            LEFT JOIN post_votes ON posts.id = post_votes.post_id 
            GROUP BY posts.id, users.username 
            ORDER BY posts.created_at DESC`
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
            `SELECT posts.id, posts.title, posts.content, posts.created_at, posts.user_id, users.username, 
            COALESCE(SUM(post_votes.vote_type), 0) as score 
            FROM posts 
            JOIN users ON posts.user_id = users.id 
            LEFT JOIN post_votes ON posts.id = post_votes.post_id 
            WHERE posts.id = $1 
            GROUP BY posts.id, users.username`,
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

const votePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { user_id, vote_type } = req.body;

        // Check if user already voted
        const existingVote = await pool.query(
            "SELECT * FROM post_votes WHERE user_id = $1 AND post_id = $2",
            [user_id, id]
        );

        if (existingVote.rows.length > 0) {
            // Update existing vote
            if (existingVote.rows[0].vote_type === vote_type) {
                // If same vote, remove it (toggle)
                await pool.query("DELETE FROM post_votes WHERE id = $1", [existingVote.rows[0].id]);
                return res.json({ message: "Vote removed" });
            } else {
                // Change vote
                await pool.query("UPDATE post_votes SET vote_type = $1 WHERE id = $2", [vote_type, existingVote.rows[0].id]);
                return res.json({ message: "Vote updated" });
            }
        } else {
            // Insert new vote
            await pool.query("INSERT INTO post_votes (user_id, post_id, vote_type) VALUES ($1, $2, $3)", [user_id, id, vote_type]);
            return res.status(201).json({ message: "Vote added" });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
    }
};

const getPostsByUser = async (req, res) => {
    try {
        const { username } = req.params;
        const userPosts = await pool.query(
            `SELECT posts.id, posts.title, posts.content, posts.created_at, posts.user_id, users.username, 
            COALESCE(SUM(post_votes.vote_type), 0) as score 
            FROM posts 
            JOIN users ON posts.user_id = users.id 
            LEFT JOIN post_votes ON posts.id = post_votes.post_id 
            WHERE users.username = $1
            GROUP BY posts.id, users.username 
            ORDER BY posts.created_at DESC`,
            [username]
        );
        res.json(userPosts.rows);
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
    deletePost,
    votePost,
    getPostsByUser
};
