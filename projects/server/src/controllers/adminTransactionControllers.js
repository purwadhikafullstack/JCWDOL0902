const { Op } = require("sequelize");

//import model
const db = require("../models");
const transaction = db.transaction;
const user = db.user;
const orderStatus = db.order_status;
const userAddress = db.user_address;
const warehouse = db.warehouse_location;

module.exports = {
    fetchAllTransactions: async (req, res) => {
        try {
            const { search, sort, order, page, startDate, endDate } = req.query;

            const { count, rows } = await transaction.findAndCountAll({
                include: [
                    {
                        model: orderStatus,
                    },
                    {
                        model: warehouse,
                    },
                    {
                        model: userAddress,
                    },
                    {
                        model: user,
                        attributes: { exclude: ["password"] },
                    },
                ],
                where: {
                    [Op.and]: [
                        {
                            [Op.or]: [
                                {
                                    "$warehouse_location.warehouse_name$": {
                                        [Op.like]: `%${search}%`,
                                    },
                                },
                            ],
                        },
                        startDate && endDate
                            ? {
                                  transaction_date: {
                                      [Op.between]: [startDate, endDate],
                                  },
                              }
                            : {},
                    ],
                },
                order: [[sort ? sort : "id", order ? order : "ASC"]],
                limit: 10,
                offset: page ? +page * 10 : 0,
            });
            res.status(200).send({
                pages: Math.ceil(count / 10),
                result: rows,
            });
        } catch (error) {
            console.log(error);
            res.status(400).send(error);
        }
    },
    fetchOwnWarehouseTransactions: async (req, res) => {
        try {
            const admin = dataToken;

            const warehouseExist = await warehouse.findOne({
                where: {
                    user_id: admin.id,
                },
            });

            const { search, sort, order, page, startDate, endDate } = req.query;

            const { count, rows } = await transaction.findAndCountAll({
                include: [
                    {
                        model: orderStatus,
                    },
                    {
                        model: warehouse,
                    },
                    {
                        model: userAddress,
                    },
                    {
                        model: user,
                        attributes: { exclude: ["password"] },
                    },
                ],
                where: {
                    warehouse_location_id: warehouseExist.id,
                    [Op.and]: [
                        {
                            [Op.or]: [
                                {
                                    "$warehouse_location.warehouse_name$": {
                                        [Op.like]: `%${search}%`,
                                    },
                                },
                            ],
                        },
                        startDate && endDate
                            ? {
                                  transaction_date: {
                                      [Op.between]: [startDate, endDate],
                                  },
                              }
                            : {},
                    ],
                },
                order: [[sort ? sort : "id", order ? order : "ASC"]],
                limit: 10,
                offset: page ? +page * 10 : 0,
            });

            res.status(200).send({
                pages: Math.ceil(count / 10),
                result: rows,
            });
        } catch (error) {
            console.log(error);
            res.status(400).send(error);
        }
    },
};
