const userModel = require("../../models/userModel");

async function updateUser(req, res) {
    try {
        const sessionUser = req.userId;
        const { userId, email, name, role, phoneNumber } = req.body;

        const payload = {
            ...(email && { email }),
            ...(name && { name }),
            ...(role && { role }),
            ...(phoneNumber && { phoneNumber })
        };

        const user = await userModel.findById(sessionUser);

        console.log("user.role", user.role);

        const updateUser = await userModel.findByIdAndUpdate(userId, payload, { new: true });

        res.json({
            data: updateUser,
            message: "User Updated",
            success: true,
            error: false
        });
    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            error: true,
            success: false
        });
    }
}

module.exports = updateUser;
