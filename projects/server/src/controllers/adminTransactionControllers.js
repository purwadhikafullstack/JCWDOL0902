const { Op } = require("sequelize");

//import model
const db = require("../models");
const transaction = db.transaction;
const transaction_item = db.transaction_item;
const product_location = db.product_location;
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
    updateStatusTransaction: async (req, res) => {
        try {
            const { body, params } = req;
            // console.log({body, params});
            await transaction.update(
                {
                    order_status_id: body.status,
                },
                { where: { id: params.id } }
            );

            if (+body.status === 6) {
                const transactions = await transaction_item.findAll({
                    where: { transaction_id: params.id },
                    include: [
                        {
                            model: product_location,
                        },
                    ],
                });

                await Promise.all(
                    transactions.map(async (trx) => {
                        const { product_location: pl } = trx;
                        await product_location.increment("qty", {
                            by: trx.qty,
                            where: {
                                id: trx.product_location_id,
                            },
                        });
                        await stock_journal.create({
                            journal_date: new Date(),
                            type: "Canceled",
                            increment_change: trx.qty,
                            decrement_change: 0,
                            total_qty_before: pl.qty,
                            new_total_qty: pl.qty + trx.qty,
                            description: "Canceled",
                            createdAt: new Date(),
                            updatedAt: new Date(),
                            product_id: pl.product_id,
                            warehouse_location_id: trx.warehouse_location_id,
                        });
                    })
                );
            }

            res.status(200).send({
                message: "status updated!",
            });
        } catch (error) {
            console.log(error);
            res.status(400).send(error);
        }
    },
};
