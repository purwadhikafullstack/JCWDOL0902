const { Op } = require("sequelize");

//import model
const db = require("../models");
const product = db.product;
const category = db.category;
const product_location = db.product_location;
const warehouse_location = db.warehouse_location;

//import delete files untuk multer
const deleteFiles = require("../helpers/deleteFiles");

//env
const dotenv = require("dotenv");
dotenv.config();

module.exports = {
    createProduct: async (req, res) => {
        try {
            const admin = dataToken;
            const { name, description, price, weight, brand, category_id } =
                req.body;

            if (
                !name ||
                !description ||
                !price ||
                !weight ||
                !brand ||
                !category_id
            ) {
                throw { message: "Please complete the product form" };
            }

            const result = await product.create({
                name,
                user_id: admin.id,
                description,
                product_image: `Public/images/${req.files.images[0].filename}`,
                price,
                weight,
                brand,
                category_id,
                stock: 0,
                is_active: true,
            });
            res.status(200).send({
                status: true,
                message: "Product successfully created",
                product: result,
            });
        } catch (error) {
            deleteFiles(req.files);
            res.status(400).send({
                status: false,
                message: error.message,
            });
        }
    },
    editProduct: async (req, res) => {
        try {
            await product.update(req.body, {
                where: {
                    id: req.params.id,
                },
            });

            res.status(200).send({
                status: true,
                message: "Successfully updating product",
            });
        } catch (error) {
            res.status(400).send({
                status: false,
                message: error.message,
            });
        }
    },
    updatePhotoProduct: async (req, res) => {
        try {
            await product.update(
                {
                    product_image: `Public/images/${req.files.images[0].filename}`,
                },
                {
                    where: {
                        id: req.params.id,
                    },
                }
            );
            res.status(200).send({
                status: true,
                message: "Product photo successfully updated",
            });
        } catch (error) {
            deleteFiles(req.files);
            res.status(400).send({
                status: false,
                message: error.message,
            });
        }
    },
    deleteProduct: async (req, res) => {
        try {
            const productExist = await product.findOne({
                where: { id: req.params.id },
            });

            if (productExist.stock > 1) {
                throw {
                    message:
                        "Please delete all remaining stocks in this product before proceeding!",
                };
            }

            await product.update(
                {
                    is_active: false,
                },
                {
                    where: {
                        id: productExist.id,
                    },
                }
            );
            res.status(200).send({
                status: true,
                message: "Product Sucessfully Deleted",
            });
        } catch (error) {
            res.status(400).send({
                status: false,
                message: error.message,
            });
        }
    },
    productList: async (req, res) => {
        //warehouse admin bisa access
        try {
            const { search, sort, order, page } = req.query;

            const allProduct = await product.findAll({
                include: [
                    {
                        model: product_location,
                        include: [{ model: warehouse_location }],
                    },
                ],
                where: {
                    is_active: true,
                },
            });

            const { count, rows } = await product.findAndCountAll({
                where: {
                    name: {
                        [Op.like]: `%${search}%`,
                    },
                    is_active: true,
                },
                include: [
                    {
                        model: category,
                    },
                ],
                order: [[sort ? sort : "id", order ? order : "ASC"]],
                limit: 10,
                offset: page ? +page * 10 : 0,
            });

            res.status(200).send({
                pages: Math.ceil(count / 10),
                result: rows,
                allProduct,
            });
        } catch (error) {
            console.log(error);
            res.status(400).send(error);
        }
    },
};
