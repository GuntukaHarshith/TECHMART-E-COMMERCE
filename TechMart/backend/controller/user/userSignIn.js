const bcrypt = require('bcryptjs');
const userModel = require('../../models/userModel');
const jwt = require('jsonwebtoken');

async function userSignInController(req, res) {
    try {
        const { identifier, password } = req.body;

        if (!identifier) {
            throw new Error("Please provide email or phone number.");}
        if (!password) {
            throw new Error("Please provide a password.");
        }

        // Find user by email or phone number
        const user = await userModel.findOne({
            $or: [{ email: identifier }, { phoneNumber: identifier }],
          });
          

        if (!user) {
            throw new Error("User not found. Please check your email or phone number.");
        }

        // Check password
        const checkPassword = await bcrypt.compare(password, user.password);

        if (checkPassword) {
            const tokenData = {
                _id: user._id,
                email: user.email,
                phoneNumber: user.phoneNumber
            };
            const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET_KEY, { expiresIn: 60 * 60 * 8 });

            const tokenOption = {
                httpOnly: true,
                secure: true,
                sameSite : 'None'
            };

            res.cookie("token", token, tokenOption).status(200).json({
                message: "Login successful",
                data: token,
                success: true,
                error: false
            });

        } else {
            throw new Error("Incorrect password. Please try again.");
        }

    } catch (err) {
        res.json({
            message: err.message || err,
            error: true,
            success: false,
        });
    }
}

module.exports = userSignInController;
