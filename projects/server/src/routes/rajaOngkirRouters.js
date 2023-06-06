const router = require("express").Router();

const { rajaOngkirControllers } = require("../controllers");

router.get("/province", rajaOngkirControllers.getProvince);
router.get("/city/:province_id", rajaOngkirControllers.getCity);

module.exports = router;
