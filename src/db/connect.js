// database connection
// MySQL used here

const connect_to_db = async (con) => {
    con.connect((err) => {
    if (err) throw err;
    console.log("connected!");
  });
};

module.exports = connect_to_db;
