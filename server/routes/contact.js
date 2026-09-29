const express = require("express");

const db = require("../database");

const router = express.Router();

router.post("/", (req, res) => {
    const {
        name,
        email,
        subject,
        message
    } = req.body;

    if (!name || !email || !subject || !message) {
        return res.status(400).json({
            success: false,
            message: "All contact fields are required."
        });
    }

    const query = `
        INSERT INTO contacts (name, email, subject, message)
        VALUES (?, ?, ?, ?)
    `;

    db.run(
        query,
        [name, email, subject, message],
        function (error) {
            if (error) {
                console.error("Contact database error:", error);

                return res.status(500).json({
                    success: false,
                    message: "Unable to save your enquiry."
                });
            }

            res.status(201).json({
                success: true,
                message: "Your enquiry has been received.",
                contactId: this.lastID
            });
        }
    );
});

module.exports = router;