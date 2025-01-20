const Database = require("better-sqlite3");
const db = new Database("./database.db");

db.exec(`
    CREATE TABLE IF NOT EXISTS movies (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        year INTEGER NOT NULL,
        seen BOOLEAN
    );
`);

console.log("Database initialized...");