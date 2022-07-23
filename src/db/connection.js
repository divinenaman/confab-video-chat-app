const mysql = require("mysql");

var connection = mysql.createConnection({
  host: process.env.DB_HOST || "localhost:3306",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "confab",
  database: process.env.DB_PASSWORD || "confab",
});

module.exports = connection;
