const express = require("express");
const cors = require("cors");
require("dotenv").config();
const pool = require("./config/db.js");
const app = express ();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hellow world");
})

app.get("/test-db", async(req, res) => {
    try{
        const result = await pool.query("SELECT NOW()");
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("makynax base de donee");
    }
})
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {console.log(`server is running on port ${PORT}`);
});

