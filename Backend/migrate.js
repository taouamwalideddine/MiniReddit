const pool = require("./config/db");

const migrate = async () => {
    try {
        console.log("Running migrations...");

        await pool.query(`
            CREATE TABLE IF NOT EXISTS post_votes (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
                vote_type INTEGER NOT NULL, -- 1 for upvote, -1 for downvote
                UNIQUE(user_id, post_id)
            );
        `);
        console.log("Created post_votes table.");

        // Add views column to posts if we want, or score column, but we can compute score on the fly.
        // Let's compute score on the fly to avoid data inconsistency.

        console.log("Migrations completed successfully!");
        process.exit(0);
    } catch (err) {
        console.error("Migration failed:", err);
        process.exit(1);
    }
};

migrate();
