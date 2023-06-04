const router = require("express").Router();
const { userAuthControllers } = require("../controllers");

router.post("/login", userAuthControllers.login);

module.exports = router;
