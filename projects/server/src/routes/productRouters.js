const express = require("express");
const router = express.Router();

//import controllers and middlewares
const { productControllers } = require("../controllers");

//paths
router.get("/fetch-all-products", productControllers.fetchAllProducts);
router.get("/product/:name", productControllers.detailProduct);
router.get("/fetch-categories", productControllers.fetchCategories);

module.exports = router;
