const bcrypt = require("bcrypt");
const salt = 10;

const hashPassword = async (password) => {
    try {
        return await bcrypt.hash(password, salt);
    } catch (error) {
        return null;
    }
};

const hashMatch = async (password, hashedPassword) => {
    try {
        let match = await bcrypt.compare(password, hashedPassword);
        return match;
    } catch (error) {
        return false;
    }
};

module.exports = {
    hashPassword,
    hashMatch,
};
