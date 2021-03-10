const mysql = require("mysql");

var connection = mysql.createConnection({
  host: "sql12.freemysqlhosting.net",
  user: "sql12370244",
  password: "aW53EBF6ib",
  database: "sql12370244",
});

module.exports = connection;
