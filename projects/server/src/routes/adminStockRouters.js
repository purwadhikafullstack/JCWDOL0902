const express = require("express");
const router = express.Router();

//import controllers and middlewares
const { adminStockControllers } = require("../controllers");
const {
    warehouseAdminLogin,
    superAdminLogin,
} = require("../middleware/authorize");

//paths
router.get(
    "/fetch-product-stock",
    warehouseAdminLogin,
    adminStockControllers.fetchProductStockList
);
router.post(
    "/add-product-stock",
    superAdminLogin,
    adminStockControllers.addProductStock
);
router.patch(
    "/update-product-stock/:id",
    superAdminLogin,
    adminStockControllers.updateProductStock
);
router.delete(
    "/delete-product-stock/:id",
    superAdminLogin,
    adminStockControllers.deleteProductStock
);

module.exports = router;
