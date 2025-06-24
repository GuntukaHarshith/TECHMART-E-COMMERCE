const userModel = require("../../models/userModel");

async function getCurrentUser(req, res) {
    try {
        console.log("User ID:", req.userId);

        // Find the user by the ID from the request (assuming req.userId is available)
        const currentUser = await userModel.findById(req.userId);

        if (!currentUser) {
            return res.status(404).json({
                message: "User not found",
                success: false,
                error: true
            });
        }

        res.json({
            message: "User profile retrieved successfully",
            data: currentUser,
            success: true,
            error: false
        });
    } catch (err) {
        res.status(400).json({
            message: err.message || "Error retrieving user profile",
            error: true,
            success: false
        });
    }
}

module.exports = getCurrentUser;
