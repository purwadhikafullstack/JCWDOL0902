const { Op } = require("sequelize");

//import model
const db = require("../models");
const journal = db.stock_journal;
const product = db.product;
const warehouse = db.warehouse_location;

module.exports = {
    fetchAllStockReport: async (req, res) => {
        try {
            const { search, sort, order, page } = req.query;

            const { count, rows } = await journal.findAndCountAll({
                include: [
                    {
                        model: product,
                        attributes: ["name"],
                    },
                    {
                        model: warehouse,
                        attributes: ["warehouse_name"],
                    },
                ],
                where: {
                    [Op.or]: [
                        {
                            "$product.name$": {
                                [Op.like]: `%${search}%`,
                            },
                        },
                        {
                            "$warehouse_location.warehouse_name$": {
                                [Op.like]: `%${search}%`,
                            },
                        },
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
    FetchOwnStockReport: async (req, res) => {
        try {
            const admin = dataToken;

            const warehouseExist = await warehouse.findOne({
                where: {
                    user_id: admin.id,
                },
            });

            const { search, sort, order, page } = req.query;

            const { count, rows } = await journal.findAndCountAll({
                include: [
                    {
                        model: product,
                        attributes: ["name"],
                    },
                    {
                        model: warehouse,
                        attributes: ["warehouse_name"],
                    },
                ],
                where: {
                    warehouse_location_id: warehouseExist.id,
                    [Op.or]: [
                        {
                            "$product.name$": {
                                [Op.like]: `%${search}%`,
                            },
                        },
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
