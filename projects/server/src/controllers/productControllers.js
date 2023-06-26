const { Op } = require("sequelize");

//import model
const db = require("../models");
const product = db.product;
const category = db.category;

module.exports = {
    fetchAllProducts: async (req, res) => {
        try {
            const { page, limit, search_query, order, by, has_stock } =
                req.query;
            const page_list = +page || 0;
            const limit_list = +limit || 12;
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
                    ...(has_stock === "true" && {
                        stock: {
                            [Op.gt]: 0,
                        },
                    }),
                    ...(has_stock === "false" && {
                        stock: 0,
                    }),
                },
            });
            const totalPage = Math.ceil(totalRows / limit_list);
            const all = await product.findAll({
                include: [
                    {
                        model: category,
                        attributes: ["name"],
                    },
                ],
                having: {
                    [Op.or]: [
                        {
                            name: {
                                [Op.like]: "%" + search + "%",
                            },
                        },
                        {
                            "$category.name$": {
                                [Op.like]: `%${search}%`,
                            },
                        },
                    ],
                    ...(has_stock === "true" && {
                        stock: {
                            [Op.gt]: 0,
                        },
                    }),
                    ...(has_stock === "false" && {
                        stock: 0,
                    }),
                },
                where: { is_active: true },
                offset: offset,
                limit: limit_list,
                order: [[order_by, direction]],
            });

            res.status(200).send({
                result: all,
                totalPage: totalPage,
            });
        } catch (error) {
            res.status(400).send(error);
        }
    },
    detailProduct: async (req, res) => {
        try {
            const result = await product.findOne({
                include: [
                    {
                        model: category,
                        attributes: ["name"],
                    },
                ],
                where: {
                    name: req.params.name,
                },
            });
            const weight = result.weight >= 1000 ? result.weight / 1000 : "";
            res.status(200).send({
                result: result,
                weight: weight,
            });
        } catch (error) {
            res.status(400).send(error);
        }
    },
    fetchCategories: async (req, res) => {
        try {
            const result = await category.findAll({
                attributes: { exclude: ["createdAt", "updatedAt"] },
                raw: true,
            });

            res.status(200).send({
                result: result,
            });
        } catch (error) {
            res.status(400).send(error);
        }
    },
};
