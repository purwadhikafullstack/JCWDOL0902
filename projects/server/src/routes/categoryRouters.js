const express = require("express");
const router = express.Router();

//import controllers and middlewares
const { categoryControllers } = require("../controllers");
const { login } = require("../middleware/authorize");

//paths
router.get("/fetch-categories", login, categoryControllers.fetchAllCategory);
router.post("/add-category", login, categoryControllers.addCategory);
router.patch("/edit-category/:id", login, categoryControllers.editCategory);
router.delete(
    "/delete-category/:id",
    login,
    categoryControllers.deleteCategory
);

module.exports = router;
