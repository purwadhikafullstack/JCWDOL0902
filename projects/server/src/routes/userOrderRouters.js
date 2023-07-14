const express = require('express');
const router = express.Router();

//import controllers and middlewares
const { userOrderControllers } = require('../controllers');
const { login } = require('../middleware/authorize');

//paths
router.get('/fetch-cart', login, userOrderControllers.fetchCart);
router.get(
    '/get-warehouse/:id',
    login,
    userOrderControllers.getNearestWarehouse
);
router.post('/create-order/:id', login, userOrderControllers.createOrder);
router.patch('/add-to-cart/:id', login, userOrderControllers.addProductToCart);
router.patch(
    '/edit-cart-qty/:id',
    login,
    userOrderControllers.editProductCartQty
);
router.delete(
    '/remove-product-cart/:id',
    userOrderControllers.removeProductFromCart
);

module.exports = router;
