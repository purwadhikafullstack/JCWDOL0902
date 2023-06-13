const express = require("express");
const router = express.Router();

//import controllers and middlewares
const { adminWarehouseControllers } = require("../controllers");
const { superAdminLogin, warehouseAdminLogin } = require("../middleware/authorize");

//paths
router.post(
    "/create-warehouse",
    superAdminLogin,
    adminWarehouseControllers.createWarehouse
);
router.get(
    "/fetch-warehouses",
    // superAdminLogin,
    warehouseAdminLogin,
    adminWarehouseControllers.fetchWarehouses
);
router.patch(
    "/update-warehouse/:id",
    superAdminLogin,
    adminWarehouseControllers.editWarehouse
);
router.delete(
    "/delete-warehouse/:id",
    superAdminLogin,
    adminWarehouseControllers.deleteWarehouse
);

module.exports = router;
