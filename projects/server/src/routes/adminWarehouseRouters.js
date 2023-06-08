const express = require("express");
const router = express.Router();

//import controllers and middlewares
const { adminWarehouseControllers } = require("../controllers");
const { login } = require("../middleware/authorize");

//paths
router.post(
    "/createwarehouse",
    login,
    adminWarehouseControllers.createWarehouse
);
router.get(
    "/fetchwarehouses",
    login,
    adminWarehouseControllers.fetchWarehouses
);
router.patch(
    "/updatewarehouse/:id",
    login,
    adminWarehouseControllers.editWarehouse
);
router.delete(
    "/deletewarehouse/:id",
    login,
    adminWarehouseControllers.deleteWarehouse
);

module.exports = router;
