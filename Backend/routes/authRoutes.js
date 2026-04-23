const express = require("express");
const router = express.Router();

// Import the controllers we just made
const { register, login } = require("../controllers/authController");

// Define the routes and link them to the controller functions
router.post("/register", register);
router.post("/login", login);

module.exports = router;
