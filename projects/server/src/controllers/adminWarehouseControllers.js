const { Op } = require("sequelize");
const axios = require("axios");

//import model
const db = require("../models");
const warehouse = db.warehouse_location;
const user = db.user;

//env
const dotenv = require("dotenv");
dotenv.config();

module.exports = {
    createWarehouse: async (req, res) => {
        try {
            const {
                warehouse_name,
                address,
                city,
                city_id,
                province,
                province_id,
                user_id,
            } = req.body;

            let warehouseAddress = `${address}%20${city}%20${province}`;

            let response = await axios.get(
                `${process.env.OPENCAGE_URL}${warehouseAddress}&key=${process.env.OPENCAGE_KEY}`
            );
            // console.log(response.data);

            let dataUser = await user.findOne({
                where: {
                    id: user_id,
                },
            });

            if (!dataUser) throw { message: "User not found!" };

            if (dataUser.role === 1) {
                await user.update(
                    {
                        role: 2,
                    },
                    {
                        where: {
                            id: dataUser.id,
                        },
                    }
                );
            }

            const result = await warehouse.create({
                warehouse_name,
                address,
                city,
                city_id,
                province,
                province_id,
                user_id,
                latitude: response.data.results[0].geometry.lat,
                longitude: response.data.results[0].geometry.lng,
            });

            res.status(200).send({
                status: true,
                message: `Warehouse Successfuly Created and Asigned to User: ${dataUser.name}`,
                data: result,
            });
        } catch (error) {
            res.status(400).send({
                status: false,
                message: error.message,
            });
        }
    },
    fetchWarehouses: async (req, res) => {
        try {
            const { search, sort, order, page } = req.query;

            const { count, rows } = await warehouse.findAndCountAll({
                where: {
                    warehouse_name: {
                        [Op.like]: `%${search}%`,
                    },
                },
                order: [[sort ? sort : "id", order ? order : "ASC"]],
                limit: 10,
                offset: page ? +page * 10 : 0,
                raw: true,
            });

            res.status(200).send({
                status: true,
                message: "Successfuly fetching All Warehouses",
                pages: Math.ceil(count / 10),
                result: rows,
            });
        } catch (error) {
            res.status(400).send({
                status: false,
                message: error.message,
            });
        }
    },
    editWarehouse: async (req, res) => {
        try {
            await warehouse.update(req.body, {
                where: {
                    id: req.params.id,
                },
            });

            res.status(200).send({
                status: true,
                message: "Warehouse Successfully Updated",
            });
        } catch (error) {
            res.status(400).send({
                status: false,
                message: error.message,
            });
        }
    },
    deleteWarehouse: async (req, res) => {
        try {
            await warehouse.destroy({
                where: {
                    id: req.params.id,
                },
            });
            res.status(200).send({
                status: true,
                message: "Warehouse Successfully Deleted",
            });
        } catch (error) {
            res.status(400).send({
                status: false,
                message: error.message,
            });
        }
    },
};
