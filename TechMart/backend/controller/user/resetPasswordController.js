const userModel = require('../../models/userModel');
const bcrypt = require('bcryptjs');

async function resetPasswordController(req, res) {
    try {
        const { identifier, otp, newPassword } = req.body;
       
        const user = await userModel.findOne({
            $or: [{ email: normalizedIdentifier }, { phoneNumber: normalizedIdentifier }],
            resetPasswordExpires: { $gt: Date.now() } // Ensure OTP has not expired
        });

        if (!user) {
            return res.status(400).json({
                message: "Invalid or expired OTP.",
                error: true,
                success: false,
            });
        }

        // Check if the provided OTP matches the stored hashed OTP
        const isOtpValid = await bcrypt.compare(otp, user.resetPasswordOtp);
        if (!isOtpValid) {
            return res.status(400).json({
                message: "Invalid OTP.",
                error: true,
                success: false,
            });
        }

        // Update the user's password
        user.password = await bcrypt.hash(newPassword, 10);
        user.resetPasswordOtp = undefined; // Clear the OTP
        user.resetPasswordExpires = undefined; // Clear the expiry time
        await user.save();

        res.status(200).json({
            message: "Password reset successfully.",
            success: true,
        });
    } catch (err) {
        res.status(500).json({
            message: err.message || "An error occurred.",
            error: true,
            success: false,
        });
    }
}

module.exports = resetPasswordController;
