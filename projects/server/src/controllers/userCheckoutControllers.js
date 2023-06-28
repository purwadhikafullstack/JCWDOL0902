//import model
const db = require("../models");
const cart = db.cart;
const user_address = db.user_address;
const user = db.user;

module.exports = {
    fetchCheckout: async (req, res) => {
        try {
            // Fetch cart data
            const userData = dataToken;
            const cartData = await cart.findAll({
                include: { model: product },
                where: { user_id: userData.id },
            });

            // Fetch address data
            const addressData = await user_address.findAll({
                include: { model: user },
                where: { user_id: userData.id },
            });

            // Send response
            res.status(200).send({
                status: true,
                cartData,
                addressData,
            });
        } catch (error) {
            res.status(500).send({
                status: false,
                message: error.message,
            });
        }
    },
    addAddress: async (req, res) => {
        try {
            const {
                receiver_name,
                user_address,
                province,
                province_id,
                city,
                city_id,
            } = req.body;

            const forwardAddress = await (
                await axios.get(
                    GEOAPIFY_KEY_URL +
                        `/search?street=${user_address}&postcode=${postal_code}&city=${city}&limit=1&format=json&apiKey=${GEOAPIFY_KEY}`,
                    {
                        headers: { "Accept-Encoding": "gzip,deflate,compress" },
                    }
                )
            ).data;
            const latitude = forwardAddress?.results[0]?.lat;
            const longitude = forwardAddress?.results[0]?.lon;

            const checkData = await userAddress.findAll({
                where: {
                    user_id: dataUser.id,
                },
            });
            const default_address = !checkData ? True : False;

            // add new address
            await user_address.create({
                receiver_name,
                user_address,
                province,
                province_id,
                city,
                city_id,
                latitude: latitude ? latitude : null,
                longitude: longitude ? longitude : null,
                default_address,
                createdAt: new Date(),
                updatedAt: new Date(),
                user_id: req.params.id,
            });
            // Send response
            res.status(200).send({
                status: true,
                message: "Address added successfully!",
            });
        } catch (error) {
            res.status(500).send({
                status: false,
                message: error.message,
            });
        }
    },
    updateAddress: async (req, res) => {
        try {
            const {
                receiver_name,
                user_address,
                province,
                province_id,
                city,
                city_id,
            } = req.body;
            const addressId = req.body.id;

            const forwardAddress = await (
                await axios.get(
                    GEOAPIFY_KEY_URL +
                        `/search?street=${user_address}&postcode=${postal_code}&city=${city}&limit=1&format=json&apiKey=${GEOAPIFY_KEY}`,
                    {
                        headers: { "Accept-Encoding": "gzip,deflate,compress" },
                    }
                )
            ).data;
            const latitude = forwardAddress?.results[0]?.lat;
            const longitude = forwardAddress?.results[0]?.lon;

            await user_address.update(
                {
                    receiver_name,
                    user_address,
                    province,
                    province_id,
                    city,
                    city_id,
                    latitude: latitude ? latitude : null,
                    longitude: longitude ? longitude : null,
                },
                {
                    where: { user_id: req.params.id, id: addressId },
                }
            );
            // Send response
            res.status(200).send({
                status: true,
                message: "Address edited successfully!",
            });
        } catch (error) {
            res.status(500).send({
                status: false,
                message: error.message,
            });
        }
    },
    deleteAddress: async (req, res) => {
        try {
            const addressId = req.body.id;
            // Delete address
            await user_address.destroy({
                where: { user_id: req.params, id: addressId },
            });
            // Send response
            res.status(200).send({
                status: true,
                message: "Address deleted successfully!",
            });
        } catch (error) {
            res.status(500).send({
                status: false,
                message: error.message,
            });
        }
    },
};
