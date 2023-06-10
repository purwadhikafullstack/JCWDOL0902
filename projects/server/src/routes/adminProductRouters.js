const express = require("express");
const router = express.Router();

//import controllers and middlewares
const { adminProductControllers } = require("../controllers");
const {
    login,
    superAdminLogin,
    warehouseAdminLogin,
} = require("../middleware/authorize");
const upload = require("../middleware/upload");

//paths
router.post(
    "/create-product",
    login,
    superAdminLogin,
    upload,
    adminProductControllers.createProduct
);
router.patch(
    "/edit-product/:id",
    superAdminLogin,
    adminProductControllers.editProduct
);
router.patch(
    "/update-photo-product/:id",
    superAdminLogin,
    upload,
    adminProductControllers.updatePhotoProduct
);
router.delete(
    "/delete-product/:id",
    superAdminLogin,
    adminProductControllers.deleteProduct
);
router.get(
    "/fetch-productlist",
    warehouseAdminLogin,
    adminProductControllers.productList
);

module.exports = router;
