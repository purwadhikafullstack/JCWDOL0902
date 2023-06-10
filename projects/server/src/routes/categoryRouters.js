const express = require("express");
const router = express.Router();

//import controllers and middlewares
const { categoryControllers } = require("../controllers");
const {
    warehouseAdminLogin,
    superAdminLogin,
} = require("../middleware/authorize");

//paths
router.get(
    "/fetch-categories",
    warehouseAdminLogin,
    categoryControllers.fetchAllCategory
);
router.post("/add-category", superAdminLogin, categoryControllers.addCategory);
router.patch(
    "/edit-category/:id",
    superAdminLogin,
    categoryControllers.editCategory
);
router.delete(
    "/delete-category/:id",
    superAdminLogin,
    categoryControllers.deleteCategory
);

module.exports = router;
