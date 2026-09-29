const express = require("express");

const db = require("../database");
const { requireAdmin } = require("../middleware/auth");

const router = express.Router();

// Get all appointment requests
router.get("/appointments", requireAdmin, (req, res) => {
    const query = `
        SELECT
            id,
            name,
            email,
            phone,
            pet_name,
            pet_type,
            service,
            preferred_date,
            preferred_time,
            message,
            status,
            created_at
        FROM appointments
        ORDER BY created_at DESC
    `;

    db.all(query, [], (error, appointments) => {
        if (error) {
            console.error("Appointments database error:", error);

            return res.status(500).json({
                success: false,
                message: "Unable to load appointments."
            });
        }

        res.json({
            success: true,
            appointments
        });
    });
});


// Update appointment status
router.patch("/appointments/:id/status", requireAdmin, (req, res) => {
    const appointmentId = req.params.id;
    const { status } = req.body;

    const allowedStatuses = [
        "pending",
        "confirmed",
        "completed",
        "cancelled"
    ];

    if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
            success: false,
            message: "Invalid appointment status."
        });
    }

    const query = `
        UPDATE appointments
        SET status = ?
        WHERE id = ?
    `;

    db.run(query, [status, appointmentId], function (error) {
        if (error) {
            console.error("Appointment status update error:", error);

            return res.status(500).json({
                success: false,
                message: "Unable to update appointment status."
            });
        }

        if (this.changes === 0) {
            return res.status(404).json({
                success: false,
                message: "Appointment not found."
            });
        }

        res.json({
            success: true,
            message: "Appointment status updated successfully.",
            status
        });
    });
});


// Get all contact enquiries
router.get("/contacts", requireAdmin, (req, res) => {
    const query = `
        SELECT
            id,
            name,
            email,
            subject,
            message,
            created_at
        FROM contacts
        ORDER BY created_at DESC
    `;

    db.all(query, [], (error, contacts) => {
        if (error) {
            console.error("Contacts database error:", error);

            return res.status(500).json({
                success: false,
                message: "Unable to load contact enquiries."
            });
        }

        res.json({
            success: true,
            contacts
        });
    });
});

module.exports = router;