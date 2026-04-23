const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// User Registration
const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // 1. Check if user already exists
        const userExists = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({ error: "User already exists" });
        }

        // 2. Hash the password before saving it (for security)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Insert the new user into the database
        const newUser = await pool.query(
            "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email",
            [username, email, hashedPassword]
        );

        // 4. Send back the newly created user (without the password)
        res.status(201).json(newUser.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
    }
};

// User Login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Find the user by email
        const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (user.rows.length === 0) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // 2. Compare the provided password with the hashed password in the DB
        const validPassword = await bcrypt.compare(password, user.rows[0].password);
        if (!validPassword) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // 3. Generate a JWT token to keep the user logged in
        // We need a secret key for this, we will use a simple one from .env or fallback
        const jwtSecret = process.env.JWT_SECRET || "supersecretkey";
        const token = jwt.sign({ id: user.rows[0].id }, jwtSecret, { expiresIn: "1h" });

        // 4. Send back the token and user info
        res.json({
            token,
            user: {
                id: user.rows[0].id,
                username: user.rows[0].username,
                email: user.rows[0].email
            }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
    }
};

module.exports = {
    register,
    login
};
