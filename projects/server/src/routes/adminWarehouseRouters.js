const express = require("express");
const router = express.Router();

//import controllers and middlewares
const { adminWarehouseControllers } = require("../controllers");
const { login } = require("../middleware/authorize");

//paths
router.post(
    "/create-warehouse",
    login,
    adminWarehouseControllers.createWarehouse
);
router.get(
    "/fetch-warehouses",
    login,
    adminWarehouseControllers.fetchWarehouses
);
router.patch(
    "/update-warehouse/:id",
    login,
    adminWarehouseControllers.editWarehouse
);
router.delete(
    "/delete-warehouse/:id",
    login,
    adminWarehouseControllers.deleteWarehouse
);

module.exports = router;
