const express = require("express");
const router = express.Router();

//import controllers and middlewares
const { adminSalesReportControllers } = require("../controllers");
const { warehouseAdminLogin, login } = require("../middleware/authorize");

//paths
router.get(
    "/sales-report",
    login,
    warehouseAdminLogin,
    adminSalesReportControllers.fetchTransactionData
);
router.get(
    "/sales-report-chart",
    login,
    warehouseAdminLogin,
    adminSalesReportControllers.fetchChartData
);

module.exports = router;
