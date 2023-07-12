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

module.exports = {
    fetchAll: async (req, res) => {
        try {
            const { page, user_id, status } = req.query;

            const condition = {
                user_id: user_id,
                order_status_id: status ? status : { [Op.not]: null },
            };

            const data = await transaction.findAll({
                limit: 10,
                offset: page ? +page * 10 : 0,
                where: condition,
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

            console.log(data);
            res.json(data);
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
