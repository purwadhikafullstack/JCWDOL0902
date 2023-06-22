const express = require("express");
const router = express.Router();

//import controllers and middlewares
const { userOrderControllers } = require("../controllers");
const { login } = require("../middleware/authorize");

//paths
router.get("/fetch-cart", login, userOrderControllers.fetchCart);
router.patch("/add-to-cart/:id", userOrderControllers.addProductToCart);
router.patch("/edit-cart-qty/:id", userOrderControllers.editProductCartQty);
router.delete(
    "/remove-product-cart/:id",
    userOrderControllers.removeProductFromCart
);

module.exports = router;
