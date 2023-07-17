const express = require('express');
const router = express.Router();

//import controllers and middlewares
const { userOrderControllers } = require('../controllers');

//paths
router.get("/fetch-cart/:id", userOrderControllers.fetchCart);
router.get("/get-warehouse/:id", userOrderControllers.getNearestWarehouse);
router.post("/create-order/:id", userOrderControllers.createOrder);
router.patch("/add-to-cart/:id", userOrderControllers.addProductToCart);
router.patch("/edit-cart-qty/:id", userOrderControllers.editProductCartQty);

router.delete(
    '/remove-product-cart/:id',
    userOrderControllers.removeProductFromCart
);

module.exports = router;
