const userModel = require('../../models/userModel');
const twilio = require('twilio');
const bcrypt = require('bcryptjs');
const { parsePhoneNumberFromString } = require('libphonenumber-js');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioClient = twilio(accountSid, authToken);

async function forgotPasswordController(req, res) {
    try {
        const { identifier, otp, newPassword, action } = req.body;

        console.log("Received request:", { identifier, otp, newPassword, action });

        if (action === "sendOtp") {
            const normalizedIdentifier = identifier.toLowerCase().replace(/\s+/g, '');

            const user = await userModel.findOne({
                $or: [{ email: normalizedIdentifier }, { phoneNumber: normalizedIdentifier }],
            });

            if (!user) {
                return res.status(404).json({
                    message: "User not found.",
                    error: true,
                    success: false,
                });
            }

            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            const hashedOtp = await bcrypt.hash(otp, 10);

            user.resetPasswordOtp = hashedOtp; // Save the hashed OTP
            user.resetPasswordExpires = Date.now() + 300000; // OTP valid for 5 minutes
            await user.save();

            console.log("Saved user OTP hash:", user.resetPasswordOtp); // Log saved OTP

            const phoneNumber = parsePhoneNumberFromString(user.phoneNumber, 'IN');
            if (!phoneNumber || !phoneNumber.isValid()) {
                return res.status(400).json({
                    message: "Invalid phone number format.",
                    error: true,
                    success: false,
                });
            }

            await twilioClient.messages.create({
                to: phoneNumber.format('E.164'),
                from: process.env.TWILIO_PHONE_NUMBER,
                body: `Your password reset OTP is: ${otp}`,
            });

            return res.status(200).json({
                message: "OTP sent to your phone.",
                success: true,
            });

        } else if (action === "verifyOtpAndResetPassword") {
            const user = await userModel.findOne({
                $or: [{ email: identifier }, { phoneNumber: identifier }],
            });

            if (!user) {
                return res.status(404).json({
                    message: "User not found.",
                    error: true,
                    success: false,
                });
            }

            console.log("Retrieved user object:", user); // Log retrieved user

            if (Date.now() > user.resetPasswordExpires) {
                return res.status(400).json({
                    message: "OTP has expired. Please request a new one.",
                    error: true,
                    success: false,
                });
            }

            console.log("Comparing OTP:", otp);
            console.log("User stored OTP hash:", user.resetPasswordOtp);

            const isOtpValid = await bcrypt.compare(otp, user.resetPasswordOtp);
            if (!isOtpValid) {
                return res.status(400).json({
                    message: "Invalid OTP. Please try again.",
                    error: true,
                    success: false,
                });
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);
            user.password = hashedPassword;
            user.resetPasswordOtp = undefined; // Clear OTP after usage
            user.resetPasswordExpires = undefined; // Clear expiry after usage

            await user.save();

            return res.status(200).json({
                message: "Password reset successfully.",
                success: true,
            });
        } else {
            return res.status(400).json({
                message: "Invalid action.",
                error: true,
                success: false,
            });
        }

    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: err.message || "An error occurred.",
            error: true,
            success: false,
        });
    }
}

module.exports = forgotPasswordController;
