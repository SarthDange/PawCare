function requireAdmin(req, res, next) {
    // Check whether an authenticated admin user exists
    if (!req.session || !req.session.user) {
        return res.status(401).json({
            success: false,
            message: "Admin authentication required."
        });
    }

    // Check the user's role
    if (req.session.user.role !== "admin") {
        return res.status(403).json({
            success: false,
            message: "Admin access required."
        });
    }

    next();
}

module.exports = {
    requireAdmin
};