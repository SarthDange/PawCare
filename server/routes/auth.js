const express = require("express");
const bcrypt = require("bcrypt");

const db = require("../database");

const router = express.Router();

// Admin login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required."
            });
        }

        const query = `
            SELECT id, name, email, password_hash, role
            FROM users
            WHERE email = ?
        `;

        db.get(query, [email], async (error, user) => {
            if (error) {
                console.error("Login database error:", error);

                return res.status(500).json({
                    success: false,
                    message: "Unable to process login."
                });
            }

            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid email or password."
                });
            }

            const passwordMatches = await bcrypt.compare(
                password,
                user.password_hash
            );

            if (!passwordMatches) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid email or password."
                });
            }

            // Only admin accounts can access the admin area
            if (user.role !== "admin") {
                return res.status(403).json({
                    success: false,
                    message: "Admin access required."
                });
            }

            req.session.user = {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            };

            res.json({
                success: true,
                message: "Login successful.",
                user: req.session.user
            });
        });

    } catch (error) {
        console.error("Login error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to process login."
        });
    }
});

// Check current login session
router.get("/me", (req, res) => {
    if (!req.session || !req.session.user) {
        return res.status(401).json({
            success: false,
            message: "Not authenticated."
        });
    }

    res.json({
        success: true,
        user: req.session.user
    });
});

// Admin logout
router.post("/logout", (req, res) => {
    if (!req.session) {
        return res.json({
            success: true,
            message: "Logged out successfully."
        });
    }

    req.session.destroy((error) => {
        if (error) {
            console.error("Logout error:", error);

            return res.status(500).json({
                success: false,
                message: "Unable to log out."
            });
        }

        res.json({
            success: true,
            message: "Logged out successfully."
        });
    });
});

module.exports = router;