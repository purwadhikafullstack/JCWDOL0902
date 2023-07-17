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
                const total_qty_before = productToUpdate.stock;
                await productToUpdate.update({ stock: updatedStock });

                // Create initial stock_journal entry
                await stock_journal.create({
                    journal_date: new Date(),
                    type: "Add Initial Stock",
                    increment_change: qty,
                    decrement_change: 0,
                    total_qty_before,
                    new_total_qty: updatedStock,
                    description: "Add Initial Stock",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    product_id,
                    warehouse_location_id,
                });
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
            const {
                type,
                increment_change,
                decrement_change,
                new_total_qty,
                description,
                product_id,
                warehouse_location_id,
                product_location_id,
                product_stock,
            } = req.body;

            const currentProductStock = await product.findByPk(product_id);

            if (!currentProductStock) {
                throw { message: "Product not found" };
            }

            const total_qty_before = currentProductStock.stock;

            // Update Stock in Product
            await product.update(
                {
                    stock: product_stock + increment_change - decrement_change,
                    updatedAt: new Date(),
                },
                {
                    where: {
                        id: req.params.id,
                    },
                }
            );

            // Update qty in product_location
            await product_location.update(
                {
                    qty: new_total_qty,
                },
                {
                    where: {
                        id: product_location_id,
                    },
                }
            );

            // Create stock_journal entry
            await stock_journal.create({
                journal_date: new Date(),
                type,
                increment_change: increment_change,
                decrement_change: decrement_change,
                total_qty_before,
                new_total_qty:
                    product_stock + increment_change - decrement_change,
                description,
                createdAt: new Date(),
                updatedAt: new Date(),
                product_id,
                warehouse_location_id,
            });

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
        try {
            const productLocation = await product_location.findOne({
                include: [
                    {
                        model: product,
                        attributes: ["id", "name", "stock", "user_id"],
                    },
                    {
                        model: warehouse_location,
                        attributes: ["id", "warehouse_name", "user_id"],
                    },
                ],
                where: {
                    id: req.params.id,
                },
            });
            if (!productLocation) {
                throw { message: "Product location not found" };
            }
            const deletedQty = productLocation.qty;
            await stock_journal.create({
                journal_date: new Date(),
                type: "Stock Deleted by Admin",
                decrement_change: deletedQty,
                total_qty_before: deletedQty,
                new_total_qty: 0,
                description: "Stock Deleted by Admin",
                createdAt: new Date(),
                updatedAt: new Date(),
                product_id: productLocation.product.id,
                warehouse_location_id: productLocation.warehouse_location.id,
            });
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
            // console.log(error);
            res.status(400).send({
                status: true,
                message: error.message,
            });
        }
    },
    fetchProductStockList: async (req, res) => {
        //warehouse admin bisa access
        try {
            const { search, sort, order, page, warehouse } = req.query;
            const warehouse_id =
                warehouse === "All Warehouse" ? null : warehouse;

            const warehouseWhere =
                warehouse_id !== null
                    ? { warehouse_location_id: warehouse_id }
                    : {};

            const { count, rows } = await product_location.findAndCountAll({
                include: [
                    {
                        model: product,
                        attributes: ["id", "name", "stock", "user_id"],
                    },
                    {
                        model: warehouse_location,
                        attributes: ["id", "warehouse_name", "user_id"],
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
                where: warehouseWhere,
                order: [[sort ? sort : "id", order ? order : "ASC"]],
                limit: 10,
                offset: page ? +page * 10 : 0,
            });

            const allProductStock = await product_location.findAll({
                include: { model: warehouse_location },
            });
            res.status(200).send({
                pages: Math.ceil(count / 10),
                result: rows,
                allProductStock,
            });
        } catch (error) {
            // console.log(error);
            res.status(400).send(error);
        }
    },
};
