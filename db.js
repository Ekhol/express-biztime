const { Client } = require("pg");

let DB_URI;

if (process.env.NODE_ENV === "test") {
    DB_URI = "postgresql://%2Fvar%2Frun%2Fpostgresql/biztime_test";
} else {
    DB_URI = "postgresql://%2Fvar%2Frun%2Fpostgresql/biztime";
}

const db = new Client({
    connectionString: DB_URI
});

db.connect();

module.exports = db;

