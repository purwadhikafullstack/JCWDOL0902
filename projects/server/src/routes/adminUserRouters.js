const express = require("express");
const router = express.Router();

//import controllers and middlewares
const { adminUserControllers } = require("../controllers");
const { superAdminLogin } = require("../middleware/authorize");

//paths
router.get("/fetch-users", superAdminLogin, adminUserControllers.fetchAllUser);
router.get(
    "/fetch-admins",
    superAdminLogin,
    adminUserControllers.fetchWarehouseAdmin
);
router.patch("/edit-user/:id", superAdminLogin, adminUserControllers.editUser);
router.delete(
    "/delete-user/:id",
    superAdminLogin,
    adminUserControllers.deleteUser
);

module.exports = router;
