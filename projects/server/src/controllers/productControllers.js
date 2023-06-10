const { Op } = require("sequelize");

//import model
const db = require("../models");
const product = db.product;
const category = db.category;

module.exports = {
    fetchAllProducts: async (req, res) => {
        try {
            const { page, limit, search_query, order, by } = req.query;
            const page_list = +page || 0;
            const limit_list = +limit || 9;
            const search = search_query || "";
            const offset = limit_list * page_list;
            const order_by = order || "name";
            const direction = by || "ASC";

            const totalRows = await product.count({
                where: {
                    [Op.or]: [
                        {
                            name: {
                                [Op.like]: "%" + search + "%",
                            },
                        },
                    ],
                },
            });
            const totalPage = Math.ceil(totalRows / limit_list);
            const all = await product.findAll({
                include: [
                    {
                        model: category,
                    },
                ],
                having: {
                    [Op.or]: [
                        {
                            name: {
                                [Op.like]: "%" + search + "%",
                            },
                        },
                    ],
                },
                offset: offset,
                limit: limit_list,
                order: [[order_by, direction]],
                subQuery: false,
            });
            res.status(200).send({
                result: all,
                page: page_list,
                limit: limit_list,
                offset: offset,
                totalRows: totalRows,
                totalPage: totalPage,
            });
        } catch (error) {
            res.status(400).send(error);
        }
    },
};
