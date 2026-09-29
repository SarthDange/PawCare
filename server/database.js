const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require("fs");

// Database folder
const databaseDirectory = path.join(__dirname, "..", "database");

// Create the database folder if it does not exist
if (!fs.existsSync(databaseDirectory)) {
    fs.mkdirSync(databaseDirectory, { recursive: true });
}

// Database file
const databasePath = path.join(databaseDirectory, "pawcare.db");

// Connect to SQLite database
const db = new sqlite3.Database(databasePath, (error) => {
    if (error) {
        console.error("Database connection failed:", error.message);
    } else {
        console.log("Connected to PawCare database.");
    }
});

// Create required tables
db.serialize(() => {

    // Users table
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            password_hash TEXT NOT NULL,
            role TEXT NOT NULL DEFAULT 'admin',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Appointments table
    db.run(`
        CREATE TABLE IF NOT EXISTS appointments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            phone TEXT NOT NULL,
            pet_name TEXT NOT NULL,
            pet_type TEXT NOT NULL,
            service TEXT NOT NULL,
            preferred_date TEXT NOT NULL,
            preferred_time TEXT NOT NULL,
            message TEXT,
            status TEXT NOT NULL DEFAULT 'pending',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Contact enquiries table
    db.run(`
        CREATE TABLE IF NOT EXISTS contacts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            subject TEXT NOT NULL,
            message TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

});

module.exports = db;