const express = require("express");
const router = express.Router();

//import controllers and middlewares
const { adminStockControllers } = require("../controllers");
const {
    warehouseAdminLogin,
} = require("../middleware/authorize");

//paths
router.get(
    "/fetch-product-stock",
    warehouseAdminLogin,
    adminStockControllers.fetchProductStockList
);
router.post(
    "/add-product-stock",
    warehouseAdminLogin,
    adminStockControllers.addProductStock
);
router.patch(
    "/update-product-stock/:id",
    warehouseAdminLogin,
    adminStockControllers.updateProductStock
);
router.delete(
    "/delete-product-stock/:id",
    warehouseAdminLogin,
    adminStockControllers.deleteProductStock
);

module.exports = router;
