const express = require("express");

const db = require("../database");

const router = express.Router();

router.post("/", (req, res) => {
    const {
        name,
        email,
        phone,
        pet_name,
        pet_type,
        service,
        preferred_date,
        preferred_time,
        message
    } = req.body;

    if (
        !name ||
        !email ||
        !phone ||
        !pet_name ||
        !pet_type ||
        !service ||
        !preferred_date ||
        !preferred_time
    ) {
        return res.status(400).json({
            success: false,
            message: "Please complete all required appointment fields."
        });
    }

    const query = `
        INSERT INTO appointments (
            name,
            email,
            phone,
            pet_name,
            pet_type,
            service,
            preferred_date,
            preferred_time,
            message
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.run(
        query,
        [
            name,
            email,
            phone,
            pet_name,
            pet_type,
            service,
            preferred_date,
            preferred_time,
            message || null
        ],
        function (error) {
            if (error) {
                console.error("Appointment database error:", error);

                return res.status(500).json({
                    success: false,
                    message: "Unable to save your appointment request."
                });
            }

            res.status(201).json({
                success: true,
                message: "Your appointment request has been received.",
                appointmentId: this.lastID
            });
        }
    );
});

module.exports = router;