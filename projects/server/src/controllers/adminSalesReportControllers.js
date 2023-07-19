const db = require("../models");
const { Op } = require("sequelize");
const moment = require("moment");

const transaction = db.transaction;
const transaction_item = db.transaction_item;
const product_location = db.product_location;
const user_address = db.user_address;
const warehouse_location = db.warehouse_location;
const product = db.product;
const category = db.category;

module.exports = {
    fetchTransactionData: async (req, res) => {
        try {
            const {
                year,
                month,
                categoryId,
                productId,
                search,
                sort,
                order,
                page,
            } = req.query;
            let { warehouseId } = req.query;
            const admin = dataToken;

            // Filter for warehouse admin
            if (admin.role === 2) {
                warehouseId = await warehouse_location.findOne({
                    where: { user_id: admin.id },
                });
                warehouseId = warehouseId.dataValues.id;
            }

            // Moment setting for time filter
            const thisMoment =
                month == "All Months" ? `${year}` : `${year}-${month}-1`;
            const timeType = month == "All Months" ? "year" : "month";
            const endOfMonth = moment(thisMoment).endOf(timeType).toDate();
            const startOfMonth = moment(thisMoment).startOf(timeType).toDate();

            // Where filter
            const warehouseWhere =
                warehouseId !== "All Warehouses"
                    ? {
                          "$product_location.warehouse_location.id$":
                              warehouseId,
                      }
                    : {};
            const monthWhere = {
                "$transaction.transaction_date$": {
                    [Op.between]: [startOfMonth, endOfMonth],
                },
            };
            const categoryWhere =
                categoryId !== "All Categories"
                    ? { "$product_location.product.category.id$": categoryId }
                    : {};
            const productWhere =
                productId !== "All Products"
                    ? { "$product_location.product.id$": productId }
                    : {};
            const searchWhere = {
                [Op.or]: [
                    {
                        "$product_location.warehouse_location.warehouse_name$":
                            {
                                [Op.like]: `%${search}%`,
                            },
                    },
                    {
                        "$product_location.product.name$": {
                            [Op.like]: `%${search}%`,
                        },
                    },
                    {
                        "$product_location.product.category.name$": {
                            [Op.like]: `%${search}%`,
                        },
                    },
                ],
            };
            // Fetch
            const { count, rows } = await transaction_item.findAndCountAll({
                include: [
                    {
                        model: transaction,
                        where: {
                            order_status_id: 5,
                        },
                    },
                    {
                        model: product_location,
                        include: [
                            {
                                model: product,
                                include: [
                                    {
                                        model: category,
                                    },
                                ],
                            },
                            {
                                model: warehouse_location,
                            },
                        ],
                    },
                ],
                where: Object.assign(
                    {},
                    searchWhere,
                    categoryWhere,
                    warehouseWhere,
                    productWhere,
                    monthWhere
                ),
                order: [[sort ? sort : "id", order ? order : "ASC"]],
                limit: 10,
                offset: page ? +page * 10 : 0,
            });

            const allCategories = await category.findAll();
            const allProducts = await product.findAll();
            const allWarehouses = await warehouse_location.findAll();

            res.status(200).send({
                pages: Math.ceil(count / 10),
                result: rows,
                allWarehouses,
                allCategories,
                allProducts,
            });
        } catch (error) {
            res.status(400).send({
                status: false,
                message: error.message,
            });
            console.log(error.message);
        }
    },
    fetchChartData: async (req, res) => {
        try {
            const { year, month, categoryId, productId } = req.query;

            let { warehouseId } = req.query;
            const admin = dataToken;

            // Filter for warehouse admin
            if (admin.role === 2) {
                warehouseId = await warehouse_location.findOne({
                    where: { user_id: admin.id },
                });
                warehouseId = warehouseId.dataValues.id;
            }

            // Moment setting for time filter
            const thisMoment =
                month == "All Months" ? `${year}` : `${year}-${month}-1`;
            const timeType = month == "All Months" ? "year" : "month";
            const endOfMonth = moment(thisMoment).endOf(timeType).toDate();
            const startOfMonth = moment(thisMoment).startOf(timeType).toDate();

            // Where filter
            const warehouseWhere =
                warehouseId !== "All Warehouses"
                    ? {
                          "$product_location.warehouse_location.id$":
                              warehouseId,
                      }
                    : {};
            const monthWhere = {
                "$transaction.transaction_date$": {
                    [Op.between]: [startOfMonth, endOfMonth],
                },
            };
            const categoryWhere =
                categoryId !== "All Categories"
                    ? { "$product_location.product.category.id$": categoryId }
                    : {};
            const productWhere =
                productId !== "All Products"
                    ? { "$product_location.product.id$": productId }
                    : {};

            // Fetch
            const chartData = await transaction_item.findAll({
                include: [
                    {
                        model: transaction,
                        where: {
                            order_status_id: 5,
                        },
                    },
                    {
                        model: product_location,
                        include: [
                            {
                                model: product,
                                include: [
                                    {
                                        model: category,
                                    },
                                ],
                            },
                            {
                                model: warehouse_location,
                            },
                        ],
                    },
                ],
                where: Object.assign(
                    {},
                    categoryWhere,
                    warehouseWhere,
                    productWhere,
                    monthWhere
                ),
            });

            res.status(200).send({ result: chartData });
        } catch (error) {
            res.status(400).send({
                status: false,
                message: error.message,
            });
        }
    },
};
