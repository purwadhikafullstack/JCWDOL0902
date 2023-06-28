//import sequelize
const axios = require("axios");

//import model
const db = require("../models");
const userAddress = db.user_address;
const user = db.user;

module.exports = {
    addUserAddress: async (req, res) => {
        try {
            let dataUser = dataToken;
            let {
                receiver_name,
                user_address,
                province,
                province_id,
                city,
                city_id,
                default_address,
            } = req.body;

            let checkData = await userAddress.findOne({
                where: {
                    user_id: dataUser.id,
                },
            });

            let address = `${user_address}%20${city}%20${province}`;

            let response = await axios.get(
                `https://api.opencagedata.com/geocode/v1/json?q=${address}&key=131027ee43a64fa5b70071a1c676d1b0`
            );
            // console.log(response.data.results);

            const checkMainAddress = await userAddress.findOne({
                where: { default_address: true },
            });
            if (checkMainAddress && default_address === true) {
                await userAddress.update(
                    { default_address: false },
                    { where: { default_address: true } }
                );
            }

            if (!checkData) {
                await userAddress.create({
                    user_id: dataUser.id,
                    receiver_name,
                    user_address,
                    province,
                    province_id,
                    city,
                    city_id,
                    latitude: response.data.results[0].geometry.lat,
                    longitude: response.data.results[0].geometry.lng,
                    default_address: true,
                });
            } else {
                await userAddress.create({
                    user_id: dataUser.id,
                    receiver_name,
                    user_address,
                    province,
                    province_id,
                    city,
                    city_id,
                    latitude: response.data.results[0].geometry.lat,
                    longitude: response.data.results[0].geometry.lng,
                    default_address,
                });
            }

            res.status(200).send({
                status: true,
                message: "Successfully adding address!",
            });
        } catch (error) {
            // console.log(error)
            res.status(400).send({
                status: false,
                message: error.message,
            });
        }
    },
    updateUserAddress: async (req, res) => {
        try {
            let dataUser = dataToken;

            let {
                receiver_name,
                user_address,
                province,
                province_id,
                city,
                city_id,
            } = req.body;

            let address = `${user_address}%20${city}%20${province}`;

            let response = await axios.get(
                `https://api.opencagedata.com/geocode/v1/json?q=${address}&key=131027ee43a64fa5b70071a1c676d1b0`
            );
            // console.log(response.data.results[0].geometry.lat);

            await userAddress.update(
                {
                    receiver_name,
                    user_address,
                    province,
                    province_id,
                    city,
                    city_id,
                    latitude: response.data.results[0].geometry.lat,
                    longitude: response.data.results[0].geometry.lng,
                },
                {
                    where: {
                        id: req.params.id,
                        user_id: dataUser.id,
                    },
                }
            );

            res.status(200).send({
                status: true,
                message: "successfully updating address!",
            });
        } catch (error) {
            res.status(400).send({
                status: false,
                message: error.message,
            });
        }
    },
    changeDefaultAddress: async (req, res) => {
        try {
            let dataUser = dataToken;

            let data = await userAddress.findAll({
                where: {
                    user_id: dataUser.id,
                },
            });

            for (let i = 0; i < data.length; i++) {
                if (data[i].dataValues.default_address == true) {
                    await userAddress.update(
                        {
                            default_address: false,
                        },
                        {
                            where: {
                                user_id: dataUser.id,
                            },
                        }
                    );
                }
            }

            let dataToChange = await userAddress.findOne({
                where: {
                    id: req.params.id,
                },
            });

            if (dataToChange.dataValues.default_address == false) {
                await userAddress.update(
                    {
                        default_address: 1,
                    },
                    {
                        where: {
                            id: req.params.id,
                        },
                    }
                );
            }

            res.status(200).send({
                status: true,
                message: "Successfully changing main address",
            });
        } catch (error) {
            res.status(400).send({
                status: false,
                message: error.message,
            });
        }
    },
    fetchOwnAddress: async (req, res) => {
        try {
            const userData = dataToken;

            const result = await userAddress.findAll({
                include: { model: user },
                where: { user_id: userData.id },
            });

            res.status(200).send({ result });
        } catch (error) {
            res.status(400).send({
                status: false,
                message: error.message,
            });
        }
    },
    deleteAddress: async (req, res) => {
        try {
            const userData = dataToken;

            await userAddress.destroy({
                where: { user_id: userData.id, id: req.params.id },
            });

            res.status(200).send({
                status: true,
                message: "Successfully deleting selected Address",
            });
        } catch (error) {
            res.status(400).send({
                status: false,
                message: error.message,
            });
        }
    },
};
