const express = require("express");
const router = express.Router();

//import controllers and middlewares
const { adminUserControllers } = require("../controllers");
const { login } = require("../middleware/authorize");

//paths
router.get("/fetchuser", login, adminUserControllers.fetchAllUser);
router.get("/fetchadmins", login, adminUserControllers.fetchWarehouseAdmin);
router.patch("/edituser/:id", login, adminUserControllers.editUser);
router.delete("/deleteuser/:id", login, adminUserControllers.deleteUser);

module.exports = router;
