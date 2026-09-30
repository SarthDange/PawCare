const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcrypt");

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


// Create the required database tables
function createTables() {
    return new Promise((resolve, reject) => {

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
            `, (error) => {

                if (error) {
                    return reject(error);
                }

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
                `, (error) => {

                    if (error) {
                        return reject(error);
                    }

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
                    `, (error) => {

                        if (error) {
                            return reject(error);
                        }

                        resolve();
                    });
                });
            });
        });
    });
}


// Create the production admin account if credentials are provided
function seedAdmin() {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const adminName = process.env.ADMIN_NAME || "PawCare Admin";

    // Do not create an admin automatically if credentials are not configured
    if (!adminEmail || !adminPassword) {
        return Promise.resolve();
    }

    return new Promise((resolve, reject) => {

        const query = `
            SELECT id
            FROM users
            WHERE email = ?
        `;

        db.get(query, [adminEmail], async (error, user) => {

            if (error) {
                return reject(error);
            }

            // Admin already exists
            if (user) {
                console.log("PawCare admin account already exists.");
                return resolve();
            }

            try {
                const passwordHash = await bcrypt.hash(
                    adminPassword,
                    12
                );

                const insertQuery = `
                    INSERT INTO users (
                        name,
                        email,
                        password_hash,
                        role
                    )
                    VALUES (?, ?, ?, 'admin')
                `;

                db.run(
                    insertQuery,
                    [
                        adminName,
                        adminEmail,
                        passwordHash
                    ],
                    function (insertError) {

                        if (insertError) {
                            return reject(insertError);
                        }

                        console.log(
                            `PawCare admin account created for ${adminEmail}.`
                        );

                        resolve();
                    }
                );

            } catch (hashError) {
                reject(hashError);
            }
        });
    });
}


// Database initialization
// Tables are created first, then the admin account is created.
const ready = (async () => {
    try {
        await createTables();
        await seedAdmin();

        console.log("PawCare database initialization complete.");
    } catch (error) {
        console.error(
            "Database initialization failed:",
            error.message
        );

        throw error;
    }
})();


// Expose the initialization promise while keeping
// the database object compatible with existing routes.
db.ready = ready;

module.exports = db;