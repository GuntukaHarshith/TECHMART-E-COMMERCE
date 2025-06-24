const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: String,
    phoneNumber: String, // Add this field for phone numbers
    resetPasswordOtp: String, // For storing the hashed OTP
    resetPasswordExpires: Date, // For storing the OTP expiration
    role: String
}, {
    timestamps: true
});

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;
