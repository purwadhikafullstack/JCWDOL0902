const express = require("express");
const router = express.Router();

//import controllers and middlewares
const { adminSalesReportControllers } = require("../controllers");
const { warehouseAdminLogin, login } = require("../middleware/authorize");

//paths
router.get(
    "/sale-report",
    login,
    warehouseAdminLogin,
    adminSalesReportControllers.fetchTransactionData
);

module.exports = router;
