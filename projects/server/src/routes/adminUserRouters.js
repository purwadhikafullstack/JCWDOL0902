const express = require("express");
const router = express.Router();

//import controllers and middlewares
const { adminUserControllers } = require("../controllers");
const { login } = require("../middleware/authorize");

//paths
router.get("/fetch-users", login, adminUserControllers.fetchAllUser);
router.get("/fetch-admins", login, adminUserControllers.fetchWarehouseAdmin);
router.patch("/edit-user/:id", login, adminUserControllers.editUser);
router.delete("/delete-user/:id", login, adminUserControllers.deleteUser);

module.exports = router;
