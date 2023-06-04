const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

module.exports = {
    createToken: (payload) => {
        return jwt.sign(payload, process.env.JWT_KEY, {
            expiresIn: "1d",
        });
    },

    validateToken: (token) => {
        return jwt.verify(token, process.env.JWT_KEY);
    },
};
