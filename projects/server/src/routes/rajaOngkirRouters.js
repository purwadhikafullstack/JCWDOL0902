const router = require("express").Router();

const { rajaOngkirControllers } = require("../controllers");

router.get("/province", rajaOngkirControllers.getProvince);
router.get("/city/:province_id", rajaOngkirControllers.getCity);
router.get("/cost?", rajaOngkirControllers.getOngkir);

module.exports = router;
