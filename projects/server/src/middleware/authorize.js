const { validateToken } = require("../helpers/token");

module.exports = {
    login: async (req, res, next) => {
        let token = req.headers.authorization;

        if (!token)
            return res.status(404).send({
                status: false,
                message: "Token not found",
                data: null,
            });

        token = token.split(" ")[1];

        try {
            const validateTokenResult = validateToken(token);
            dataToken = validateTokenResult;
            next();
        } catch (error) {
            res.status(500).send({
                status: false,
                message: "Token is not valid",
                data: null,
            });
        }
    },
    warehouseAdminLogin: async (req, res, next) => {
        let token = req.headers.authorization;

        if (!token)
            return res.status(404).send({
                status: false,
                message: "Token not found",
            });

        token = token.split(" ")[1];

        try {
            const checkRole = validateToken(token);
            if (checkRole.role === 1) {
                throw { message: "Unauthorized Access" };
            }
            next();
        } catch (error) {
            res.status(500).send({
                status: false,
                message: "Token is not valid",
            });
        }
    },
    superAdminLogin: async (req, res, next) => {
        let token = req.headers.authorization;

        if (!token)
            return res.status(404).send({
                status: false,
                message: "Token not found",
            });

        token = token.split(" ")[1];

        try {
            const checkRole = validateToken(token);
            if (checkRole.role === 1 || checkRole.role === 2) {
                throw { message: "Unauthorized Access" };
            }
            next();
        } catch (error) {
            res.status(500).send({
                status: false,
                message: "Token is not valid",
            });
        }
    },
};
