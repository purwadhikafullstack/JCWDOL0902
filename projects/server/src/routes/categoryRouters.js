const express = require("express");
const router = express.Router();

//import controllers and middlewares
const { categoryControllers } = require("../controllers");
const { login } = require("../middleware/authorize");

//paths
router.get("/fetchCategories", login, categoryControllers.fetchAllCategory);
router.post("/addCategory", login, categoryControllers.addCategory);
router.patch("/editCategory/:id", login, categoryControllers.editCategory);
router.delete("/deleteCategory/:id", login, categoryControllers.deleteCategory);

module.exports = router;
