const express = require('express');
const router = express.Router();

//import controllers and middlewares
const { userAddressControllers } = require('../controllers');
const { login } = require('../middleware/authorize');

//paths
router.get('/fetch-address', login, userAddressControllers.fetchOwnAddress);
router.post('/add-address', login, userAddressControllers.addUserAddress);
router.patch(
    '/update-address/:id',
    login,
    userAddressControllers.updateUserAddress
);
router.patch(
    '/change-default-address/:id',
    login,
    userAddressControllers.changeDefaultAddress
);
router.delete(
    '/delete-address/:id',
    login,
    userAddressControllers.deleteAddress
);

module.exports = router;
