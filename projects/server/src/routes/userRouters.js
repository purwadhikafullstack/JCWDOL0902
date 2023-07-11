const express = require("express");
const router = express.Router();

//import controllers and middlewares
const { userControllers } = require("../controllers");
const { login } = require("../middleware/authorize");

//paths
router.get("/keeplogin", login, userControllers.keeplogin);
router.post("/register", userControllers.register);
router.patch("/activation", userControllers.activation);
router.post("/login", userControllers.login);
router.post("/reset-password-email", userControllers.emailResetPass);
router.get("/token-validator", userControllers.tokenValidator);
router.patch("/reset-password", userControllers.resetPassword);

module.exports = router;
