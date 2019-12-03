var mysql = require("mysql");
var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "#####",
  database: "auth"
});

module.exports = connection;
