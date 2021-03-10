const connection = require("../db/creds_local");

// query database
function searchUser(username) {
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT * FROM login where userid='${username}'`,
      (err, results, fields) => {
        if (err) resolve(null);
        else {
          return resolve(results[0]);
        }
      }
    )
  })
}

module.exports = searchUser;