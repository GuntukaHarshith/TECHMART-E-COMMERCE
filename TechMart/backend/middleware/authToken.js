const jwt = require('jsonwebtoken');

async function authToken(req, res, next) {
    try {
        const token = req.cookies?.token;

        console.log("token:", token);
        
        if (!token) {
            return res.status(401).json({
                message: "Please log in.",
                error: true,
                success: false
            });
        }

        // Verify the token
        jwt.verify(token, process.env.TOKEN_SECRET_KEY, (err, decoded) => {
            if (err) {
                console.log("Token verification error:", err);
                return res.status(403).json({
                    message: "Invalid or expired token.",
                    error: true,
                    success: false
                });
            }

            // Attach user ID and admin status to the request
            req.userId = decoded._id;
            req.isAdmin = decoded.isAdmin; // Assumes `isAdmin` is stored in the token payload

            next();
        });
    } catch (err) {
        res.status(400).json({
            message: err.message || "An error occurred.",
            data: [],
            error: true,
            success: false
        });
    }
}

module.exports = authToken;
