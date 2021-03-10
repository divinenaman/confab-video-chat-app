const mysql = require("mysql");

var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "naman007",
  database: "confab",
});

module.exports = connection;
