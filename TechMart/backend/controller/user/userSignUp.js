const userModel = require("../../models/userModel");
const bcrypt = require('bcryptjs');

async function userSignUpController(req, res) {
    try {
        const { email, password, name, phoneNumber } = req.body;

        // Check if email or phone number already exists
        const existingUserByEmail = await userModel.findOne({ email });
        const existingUserByPhone = await userModel.findOne({ phoneNumber });

        if (existingUserByEmail) {
            throw new Error("A user with this email already exists.");
        }

        if (existingUserByPhone) {
            throw new Error("A user with this phone number already exists.");
        }

        // Validate inputs
        if (!email) {
            throw new Error("Please provide an email.");
        }
        if (!password) {
            throw new Error("Please provide a password.");
        }
        if (!name) {
            throw new Error("Please provide a name.");
        }
        if (!phoneNumber) {
            throw new Error("Please provide a phone number.");
        }

        // Hash the password
        const salt = bcrypt.genSaltSync(10);
        const hashPassword = await bcrypt.hashSync(password, salt);

        if (!hashPassword) {
            throw new Error("Something went wrong while hashing the password.");
        }

        // Create the user payload
        const payload = {
            email,
            name,
            phoneNumber,
            role: "GENERAL",
            password: hashPassword
        };

        // Save the user to the database
        const userData = new userModel(payload);
        const saveUser = await userData.save();

        // Respond with success
        res.status(201).json({
            data: saveUser,
            success: true,
            error: false,
            message: "User created successfully!"
        });

    } catch (err) {
        res.json({
            message: err.message || err,
            error: true,
            success: false,
        });
    }
}

module.exports = userSignUpController;
