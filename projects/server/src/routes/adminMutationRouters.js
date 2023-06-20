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
);
router.get(
    "/fetch-warehouse-mutations",
    login,
    warehouseAdminLogin,
    adminMutationControllers.fetchOwnMutation
);
router.post(
    "/req-mutation",
    login,
    warehouseAdminLogin,
    adminMutationControllers.requestMutation
);
router.patch(
    "/approve/:id",
    login,
    warehouseAdminLogin,
    adminMutationControllers.approvalMutation
);

module.exports = router;
