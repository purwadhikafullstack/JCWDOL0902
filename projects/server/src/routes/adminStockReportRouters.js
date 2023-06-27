const express = require("express");
const router = express.Router();

//import controllers and middlewares
const { adminStockReportControllers } = require("../controllers");
const {
    warehouseAdminLogin,
    superAdminLogin,
    login,
} = require("../middleware/authorize");

//paths
router.get(
    "/fetch-all-stock-reports",
    superAdminLogin,
    adminStockReportControllers.fetchAllStockReport
);
router.get(
    "/fetch-own-stock-reports",
    login,
    warehouseAdminLogin,
    adminStockReportControllers.FetchOwnStockReport
);

module.exports = router;
