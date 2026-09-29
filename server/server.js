require("dotenv").config();

const express = require("express");
const path = require("path");
const session = require("express-session");

// Load database connection
require("./database");

// Load API routes
const authRoutes = require("./routes/auth");
const contactRoutes = require("./routes/contact");
const appointmentRoutes = require("./routes/appointments");
const adminRoutes = require("./routes/admin");

const app = express();
const PORT = process.env.PORT || 3000;

// Production environment check
const isProduction = process.env.NODE_ENV === "production";

// Trust the hosting platform's proxy when running in production
if (isProduction) {
    app.set("trust proxy", 1);
}

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: isProduction,
            sameSite: "lax",
            maxAge: 1000 * 60 * 60
        }
    })
);

// Serve frontend files
app.use(express.static(path.join(__dirname, "..", "public")));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/admin", adminRoutes);

// Basic server check
app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "PawCare server is running."
    });
});

// Home page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

// Start server
app.listen(PORT, () => {
    console.log(`PawCare server running at http://localhost:${PORT}`);
});