const {Pool } = require("pg");
require("dotenv").config();

const pool = new  Pool({
    user: "postgres",
    host: "localhost",
    database: "mini_reddit",
    password: "1111",
    port: 5432
})

module.exports = pool;