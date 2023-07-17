const express = require("express");
const router = express.Router();

//import controllers and middlewares
const { adminTransactionsControllers } = require("../controllers");
const {
    login,
    superAdminLogin,
    warehouseAdminLogin,
} = require("../middleware/authorize");

//paths
router.get(
    "/fetch-all-transactions",
    superAdminLogin,
    adminTransactionsControllers.fetchAllTransactions
);
router.patch(
    "/transaction/:id",
    superAdminLogin,
    adminTransactionsControllers.updateStatusTransaction
);
router.get(
    "/fetch-warehouse-transactions",
    login,
    warehouseAdminLogin,
    adminTransactionsControllers.fetchOwnWarehouseTransactions
);
router.get(
    "/fetch-transaction-items/:id",
    adminTransactionsControllers.fetchSelectedTransItem
);

module.exports = router;
