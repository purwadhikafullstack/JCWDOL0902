const { Op } = require("sequelize");

//import model
const db = require("../models");
const product = db.product;
const warehouse_location = db.warehouse_location;
const stock_journal = db.stock_journal;
const product_location = db.product_location;

module.exports = {
    addProductStock: async (req, res) => {
        try {
            const { qty, product_id, warehouse_location_id } = req.body;

            if (!qty || !product_id || !warehouse_location_id) {
                throw { message: "Please Complete the Stock Form" };
            }

            const existingProductLocation = await product_location.findOne({
                where: {
                    product_id,
                    warehouse_location_id,
                },
            });

            if (existingProductLocation) {
                throw {
                    message:
                        "Product already exists in the specified warehouse location",
                };
            }

            const result = await product_location.create({
                qty,
                product_id,
                warehouse_location_id,
            });

            // Update product stock
            const productToUpdate = await product.findByPk(product_id);
            if (productToUpdate) {
                const updatedStock = productToUpdate.stock + parseInt(qty);
                await productToUpdate.update({ stock: updatedStock });
            }

            // Send response
            res.status(200).send({
                status: true,
                message: "Product stock updated successfully",
            });
        } catch (error) {
            res.status(500).send({
                status: false,
                message: error.message,
            });
        }
    },
    updateProductStock: async (req, res) => {
        try {
            const { increment, decrement } = req.body;

            if (increment && decrement) {
                throw {
                    message:
                        "Please provide either increment or decrement, not both",
                };
            }

            let quantityToUpdate = 0;
            if (increment) {
                quantityToUpdate = parseInt(increment);
            } else if (decrement) {
                quantityToUpdate = -parseInt(decrement);
            } else {
                throw {
                    message:
                        "Please provide either increment or decrement value",
                };
            }

            // Find product location for the given product ID
            const productLocation = await product_location.findOne({
                where: {
                    id: req.params.id,
                },
            });

            if (!productLocation) {
                throw { message: "Product not found" };
            }

            const updatedQuantity = productLocation.qty + quantityToUpdate;

            if (quantityToUpdate < 0 && updatedQuantity < 0) {
                throw {
                    message: "Cannot decrement more than the current quantity",
                };
            }

            // Update product location quantity
            await productLocation.update({ qty: updatedQuantity });

            // Update product stock in the product database
            const productToUpdate = await product.findByPk(
                productLocation.product_id
            );
            if (productToUpdate) {
                const updatedStock = productToUpdate.stock + quantityToUpdate;
                await productToUpdate.update({ stock: updatedStock });
            }

            // Send response
            res.status(200).send({
                status: true,
                message: "Product stock updated successfully",
            });
        } catch (error) {
            res.status(400).send({
                status: false,
                message: error.message,
            });
        }
    },
    deleteProductStock: async (req, res) => {
        const productLocation = await product_location.findOne({
            where: {
                id: req.params.id,
            },
        });

        if (!productLocation) {
            throw { message: "Product not found" };
        }
    },
    deleteProductStock: async (req, res) => {
        try {
            const productLocation = await product_location.findOne({
                where: {
                    id: req.params.id,
                },
            });

            if (!productLocation) {
                throw { message: "Product location not found" };
            }

            const deletedQty = productLocation.qty;

            // Delete the product location
            await productLocation.destroy();

            // Update product stock in the product database
            const productToUpdate = await product.findByPk(
                productLocation.product_id
            );
            if (productToUpdate) {
                const updatedStock = productToUpdate.stock - deletedQty;
                await productToUpdate.update({ stock: updatedStock });
            }

            // Send response
            res.status(200).send({
                status: true,
                message: "Product stock deleted successfully",
            });
        } catch (error) {
            res.status(400).send({
                status: true,
                message: error.message,
            });
        }
    },
    fetchProductStockList: async (req, res) => {
        //warehouse admin bisa access
        try {
            const { search, sort, order, page } = req.query;

            const { count, rows } = await product_location.findAndCountAll({
                include: [
                    {
                        model: product,
                        attributes: ["name", "stock", "user_id"],
                    },
                    {
                        model: warehouse_location,
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
                subQuery: false,
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
