const { Op } = require("sequelize");
const axios = require("axios");
const opencage = require("opencage-api-client");

//import model
const db = require("../models");
const warehouse = db.warehouse_location;
const user = db.user;

//env
const dotenv = require("dotenv");
dotenv.config();

module.exports = {
    fetchWarehouses: async (req, res) => {
        try {
            const getToken = dataToken;
            if (getToken.role === 1)
                throw {
                    message: "Unauthorized Access",
                };

            const { search, sort, direction, pagination } = req.query;

            const { count, rows } = await warehouse.findAndCountAll({
                where: {
                    warehouse_name: {
                        [Op.like]: `%${search}%`,
                    },
                },
                order: [[sort ? sort : "id", direction ? direction : "ASC"]],
                limit: 10,
                offset: pagination ? +pagination * 10 : 0,
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
            const getToken = dataToken;
            if (getToken.role === 1 || getToken.role === 2)
                throw {
                    message: "Unauthorized Access",
                };

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
            const getToken = dataToken;
            if (getToken.role === 1 || getToken.role === 2)
                throw {
                    message: "Unauthorized Access",
                };

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
