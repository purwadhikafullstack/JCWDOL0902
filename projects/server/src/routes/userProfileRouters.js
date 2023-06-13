const express = require("express");
const router = express.Router();

//import controllers and middlewares
const { userProfileControllers } = require("../controllers");
const { login } = require("../middleware/authorize");
const upload = require("../middleware/upload");

//paths
router.get("/profile/:id", login, userProfileControllers.fetchUserData);
router.patch(
    "/profile-settings/:id",
    login,
    userProfileControllers.profileUserSettings
);
router.patch(
    "/profile-picture/:id",
    login,
    upload,
    userProfileControllers.uploadPicture
);
router.patch(
    "/password-update/:id",
    login,
    userProfileControllers.changePassword
);

module.exports = router;
