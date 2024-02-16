const mysql = require("mysql");
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "chironess1",
  database: "blog_2",
});

module.exports = db;
