const express = require("express");
const router = express.Router();

//import controllers and middlewares
const { productControllers } = require("../controllers");

//paths
router.get("/fetch-all-products", productControllers.fetchAllProducts);

module.exports = router;
