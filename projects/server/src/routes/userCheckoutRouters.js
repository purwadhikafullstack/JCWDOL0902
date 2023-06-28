const express = require("express");
const router = express.Router();

//import controllers and middlewares
const { userCheckoutControllers } = require("../controllers");
const { login } = require("../middleware/authorize");

//paths
router.get("/fetch-checkout", login, userCheckoutControllers.fetchCheckout);
router.patch("/add-address/:id", login, userCheckoutControllers.addAddress);
router.patch("/edit-address/:id", login, userCheckoutControllers.updateAddress);
router.delete(
    "/remove-address/:id",
    login,
    userCheckoutControllers.deleteAddress
);

module.exports = router;
