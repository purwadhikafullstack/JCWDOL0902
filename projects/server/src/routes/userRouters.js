const express = require("express");
const router = express.Router();

//import controllers and middlewares
const { userControllers } = require("../controllers");

//paths
router.post("/register", userControllers.register);
router.patch("/activation/:id", userControllers.activation);

module.exports = router;
