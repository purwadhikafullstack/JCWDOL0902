const { Sequelize, Op } = require("sequelize");

//import model
const db = require("../models");
const user = db.user;
const product = db.product;
const transaction = db.transaction;
const transaction_item = db.transaction_item;
const order_status = db.order_status;
const user_address = db.user_address;
const product_location = db.product_location;
const warehouse_location = db.warehouse_location;
const stock_journal = db.stock_journal;

module.exports = {
    fetchAll: async (req, res) => {
        try {
            const { page, user_id, status } = req.query;
            const itemsPerPage = 10;
            const offset = (+page - 1) * itemsPerPage;
            const condition = {
                user_id: user_id,
                order_status_id: +status !== 0 ? +status : { [Op.not]: null },
            };
            console.log({ page, user_id, status });

            const data = await transaction.findAll({
                limit: itemsPerPage,
                offset: offset,
                where: condition,
                order: [["transaction_date", "DESC"]],
                include: [
                    {
                        model: transaction_item,
                        include: [
                            {
                                model: product_location,
                                attribute: ["qty", "product"],
                                include: [
                                    {
                                        model: product,
                                    },
                                    {
                                        model: warehouse_location,
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        model: order_status,
                        attribute: ["status", "id"],
                    },
                    {
                        model: user_address,
                        attributes: {
                            exclude: ["createdAt", "updatedAt", "user_id"],
                        },
                    },
                ],
            });

            const totalItems = await data.length;
            const totalPages = Math.ceil(totalItems / itemsPerPage);

            // console.log(data);
            res.json({ data, totalPages });
        } catch (error) {
            console.log(error);
            res.status(400).send("Failed");
        }
    },
    updateStatusTransaction: async (req, res) => {
        try {
            const { body, params, files } = req;
            const { id } = params;
            if (Object.keys(files).length > 0) {
                body.upload_payment = `Public/images/${req.files.images[0].filename}`;
            }

            if (+body.order_status_id === 6) {
                const currTransactionItems = await transaction_item.findAll({
                    where: { transaction_id: id },
                    include: [
                        {
                            model: product_location,
                        },
                    ],
                });

                await Promise.all(
                    currTransactionItems.map(async (item, i) => {
                        const { product_location: pl } = item;
                        await product_location.increment("qty", {
                            by: item.qty,
                            where: {
                                id: item.product_location_id,
                            },
                        });
                        await product.increment("stock", {
                            by: item.qty,
                            where: {
                                id: pl.product_id,
                            },
                        });
                        await stock_journal.create({
                            journal_date: new Date(),
                            type: "Canceled",
                            increment_change: item.qty,
                            decrement_change: 0,
                            total_qty_before: pl.qty,
                            new_total_qty: pl.qty + item.qty,
                            description: "Canceled",
                            createdAt: new Date(),
                            updatedAt: new Date(),
                            product_id: pl.product_id,
                            warehouse_location_id: item.warehouse_location_id,
                        });
                    })
                );
            }

            // console.log(body);
            await transaction.update(body, { where: { id } });

            res.json({
                success: true,
                message: "Status telah diupdate!",
            });
        } catch (error) {
            console.log(error);
            res.status(400).send("Failed");
        }
    },
};
