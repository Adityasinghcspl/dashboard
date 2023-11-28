const jwt = require('jsonwebtoken');
require("dotenv").config({ path: "../.env" });

// Jwt token generate
const generateToken = (userId) => {
    return jwt.sign({ user: userId }, process.env.SecretKey, { expiresIn: '30m' }); // You can adjust the expiration time as needed
};

// Jwt token verify
function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    
    if (typeof bearerHeader !== 'undefined') {
        const bearerToken = bearerHeader.split(' ')[1];
        req.token = bearerToken;

        jwt.verify(req.token, process.env.SecretKey, { maxAge: '30m' }, (err, authData) => {
            if (err) {
                res.sendStatus(403); // Forbidden
            } else {
                // Token is valid, continue with the next middleware or route handler
                req.authData = authData;
                next();
            }
        });
    } else {
        res.sendStatus(403); // Forbidden
    }
}

module.exports = { generateToken, verifyToken };
