const express = require("express");
const router = express.Router();

//import controllers and middlewares
const { categoryControllers } = require("../controllers");
const {
    warehouseAdminLogin,
    superAdminLogin,
} = require("../middleware/authorize");
const upload = require("../middleware/upload");

//paths
router.get(
    "/fetch-categories",
    warehouseAdminLogin,
    categoryControllers.fetchAllCategory
);
router.post(
    "/add-category",
    superAdminLogin,
    upload,
    categoryControllers.addCategory
);
router.patch(
    "/edit-category/:id",
    superAdminLogin,
    categoryControllers.editCategory
);
router.patch(
    "/edit-category-image/:id",
    superAdminLogin,
    upload,
    categoryControllers.updateCategoryImage
);
router.delete(
    "/delete-category/:id",
    superAdminLogin,
    categoryControllers.deleteCategory
);

module.exports = router;
