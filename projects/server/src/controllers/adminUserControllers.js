const { Op } = require("sequelize");

//import model
const db = require("../models");
const user = db.user;
const warehouse = db.warehouse_location;

//env
const dotenv = require("dotenv");
dotenv.config();

module.exports = {
    fetchAllUser: async (req, res) => {
        try {
            const { search, sort, order, page } = req.query;

            const pages = Math.ceil(
                (await user.count({
                    where: {
                        [Op.or]: [
                            {
                                name: {
                                    [Op.like]: `%${search}%`,
                                },
                            },
                            {
                                email: {
                                    [Op.like]: `%${search}%`,
                                },
                            },
                        ],
                    },
                })) / 10
            );

            const result = await user.findAll({
                where: {
                    role: {
                        [Op.lt]: 3,
                    },
                    [Op.or]: [
                        {
                            name: {
                                [Op.like]: `%${search}%`,
                            },
                        },
                        {
                            email: {
                                [Op.like]: `%${search}%`,
                            },
                        },
                    ],
                },
                order: [[sort ? sort : "id", order ? order : "ASC"]],
                limit: 10,
                offset: page ? +page * 10 : 0,
            });

            res.status(200).send({ result, pages });
        } catch (error) {
            console.log(error);
            res.status(400).send({
                status: false,
                message: error.message,
            });
        }
    },
    editUser: async (req, res) => {
        try {
            await user.update(req.body, {
                where: {
                    id: req.params.id,
                },
            });
            res.status(200).send({
                status: true,
                message: "User Successfuly Updated",
            });
        } catch (error) {
            res.status(400).send({
                status: false,
                message: error.message,
            });
        }
    },
    deleteUser: async (req, res) => {
        try {
            const userExist = await user.findOne({
                where: { id: req.params.id },
            });

            const warehouseExist = await warehouse.findAll({
                where: { user_id: userExist.id },
            });

            if (warehouseExist.length > 0) {
                throw {
                    message:
                        "Cannot delete a user who is still assigned to a warehouse!",
                };
            }

            await user.destroy({
                where: {
                    id: userExist.id,
                },
            });
            res.status(200).send({
                status: true,
                message: "User Successfuly Deleted",
            });
        } catch (error) {
            res.status(400).send({
                status: false,
                message: error.message,
            });
        }
    },
    fetchWarehouseAdmin: async (req, res) => {
        try {
            const result = await user.findAll({
                where: {
                    role: 2,
                },
                raw: true,
            });
            res.status(200).send(result);
        } catch (err) {
            res.status(400).send(err);
        }
    },
};
