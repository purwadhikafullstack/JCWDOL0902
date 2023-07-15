const express = require("express");
const router = express.Router();

//import controllers and middlewares
const { adminMutationControllers } = require("../controllers");
const {
    login,
    superAdminLogin,
    warehouseAdminLogin,
} = require("../middleware/authorize");

//paths
router.get(
    "/fetch-all-mutations",
    superAdminLogin,
    adminMutationControllers.fetchAllMutation
);//fetch all mutations untuk super admin
router.get(
    "/fetch-warehouse-mutations",
    login,
    warehouseAdminLogin,
    adminMutationControllers.fetchOwnMutation
);//fetch all mutations untuk warehouse admin
router.get(
    "/fetch-mutation-requests",
    login,
    warehouseAdminLogin,
    adminMutationControllers.fetchOwnRequests
);//fetch mutation request untuk warehouse admin
router.get(
    "/fetch-available-stock/:id",
    warehouseAdminLogin,
    adminMutationControllers.fetchAvailableStock
);//fetch available stock untuk warehouse admin
router.post(
    "/req-mutation",
    login,
    warehouseAdminLogin,
    adminMutationControllers.requestMutation
);//create request mutation untuk warehouse admin
router.patch(
    "/approve/:id",
    login,
    warehouseAdminLogin,
    adminMutationControllers.approvalMutation
);//approve mutation untuk warehouse admin

module.exports = router;
