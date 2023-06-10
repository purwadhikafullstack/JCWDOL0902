const { Op } = require("sequelize");

//import model
const db = require("../models");
const category = db.category;

module.exports = {
    fetchAllCategory: async (req, res) => {
        try {
            const { search, sort, order, page } = req.query;

            const pages = Math.ceil(
                (await category.count({
                    where: {
                        [Op.or]: [
                            {
                                name: {
                                    [Op.like]: `%${search}%`,
                                },
                            },
                        ],
                    },
                })) / 10
            );

            const result = await category.findAll({
                where: {
                    [Op.or]: [
                        {
                            name: {
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
            res.status(400).send({
                status: false,
                message: error.message,
            });
        }
    },
    addCategory: async (req, res) => {
        try {
            const { name } = req.body;

            if (!name) throw { message: "Please input the category name" };

            const dataCategory = await category.findOne({
                where: {
                    name,
                },
            });
            if (dataCategory) throw { message: "Category already existed" };

            const createCategory = await category.create({ name });

            res.status(200).send({
                status: true,
                message: "Category Successfully Added",
                data: createCategory,
            });
        } catch (error) {
            res.status(400).send({
                status: false,
                message: error.message,
            });
        }
    },
    editCategory: async (req, res) => {
        try {
            await category.update(
                {
                    name: req.body.name,
                    updatedAt: new Date(),
                },
                {
                    where: {
                        id: req.params.id,
                    },
                }
            );

            res.status(200).send({
                status: true,
                message: "Category Successfully Updated",
            });
        } catch (error) {
            res.status(400).send({
                status: false,
                message: error.message,
            });
        }
    },
    deleteCategory: async (req, res) => {
        try {
            await category.destroy({
                where: {
                    id: req.params.id,
                },
            });

            res.status(200).send({
                status: true,
                message: "Category Successfuly Deleted",
            });
        } catch (error) {
            res.status(400).send({
                status: false,
                message: error.message,
            });
        }
    },
};
