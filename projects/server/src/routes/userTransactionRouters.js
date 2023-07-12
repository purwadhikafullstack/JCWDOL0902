const express = require("express");
const router = express.Router();

//import controllers and middlewares
const { userTransactionControllers } = require("../controllers");
const { login } = require("../middleware/authorize");
const upload = require("../middleware/upload");

router.get("/transactions?", login, userTransactionControllers.fetchAll);
router.patch(
    "/transaction/:id",
    login,
    upload,
    userTransactionControllers.updateStatusTransaction
);

module.exports = router;
