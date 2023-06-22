const { Op, where } = require("sequelize");

//import model
const db = require("../models");
const mutation = db.warehouse_mutation;
const warehouse = db.warehouse_location;
const productLocation = db.product_location;
const product = db.product;
const journal = db.stock_journal;

module.exports = {
    //untuk super admin
    fetchAllMutation: async (req, res) => {
        try {
            const { sort, order, page } = req.query;

            await mutation.findAll();

            const { count, rows } = await mutation.findAndCountAll({
                include: [
                    {
                        model: warehouse,
                    },
                    {
                        model: product,
                    },
                ],
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
    // untuk warehouse admin
    fetchOwnMutation: async (req, res) => {
        try {
            const admin = dataToken;

            const warehouseExist = await warehouse.findOne({
                where: {
                    user_id: admin.id,
                },
            });

            const { sort, order, page } = req.query;

            await mutation.findAll();

            const { count, rows } = await mutation.findAndCountAll({
                where: {
                    warehouse_approve_id: warehouseExist.id,
                },
                include: [
                    {
                        model: warehouse,
                    },
                    {
                        model: product,
                    },
                ],
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
    fetchOwnRequests: async (req, res) => {
        try {
            const admin = dataToken;

            const warehouseExist = await warehouse.findOne({
                where: {
                    user_id: admin.id,
                },
            });

            const { sort, order, page } = req.query;

            await mutation.findAll();

            const { count, rows } = await mutation.findAndCountAll({
                where: {
                    warehouse_req_id: warehouseExist.id,
                },
                include: [
                    {
                        model: warehouse,
                    },
                    {
                        model: product,
                    },
                ],
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
    fetchAvailableStock: async (req, res) => {
        try {
            const result = await productLocation.findAll({
                where: {
                    warehouse_location_id: req.params.id,
                },
                include: [
                    {
                        model: product,
                    },
                ],
            });

            res.status(200).send({ result });
        } catch (error) {
            console.log(error);
            res.status(400).send(error);
        }
    },
    requestMutation: async (req, res) => {
        try {
            const admin = dataToken;
            const { warehouse_approve_id, product_id, qty, remarks } = req.body;

            const warehouseExist = await warehouse.findOne({
                where: {
                    user_id: admin.id,
                },
            });

            const productLocationApproval = await productLocation.findOne({
                where: {
                    warehouse_location_id: warehouse_approve_id,
                    product_id: product_id,
                },
            });

            if (productLocationApproval.qty < qty) {
                throw {
                    message: "Insufficient quantity in the selected warehouse",
                };
            }

            await mutation.create({
                warehouse_req_id: warehouseExist.id,
                warehouse_approve_id,
                product_id,
                qty,
                remarks,
                approved: "none",
                requested_by: warehouseExist.warehouse_name,
            });

            res.status(200).send({
                status: true,
                message: "Successfully Requesting Mutation",
            });
        } catch (error) {
            res.status(400).send({
                status: false,
                message: error.message,
            });
        }
    },
    approvalMutation: async (req, res) => {
        try {
            const admin = dataToken;
            const { approved } = req.body;

            const warehouseExist = await warehouse.findOne({
                where: {
                    user_id: admin.id,
                },
            });

            const mutationExist = await mutation.findOne({
                where: {
                    id: req.params.id,
                    warehouse_approve_id: warehouseExist.id,
                },
            });

            if (!mutationExist) {
                throw { message: "Mutation request does not exist!" };
            }

            if (
                mutationExist.approved === "Rejected" ||
                mutationExist.approved === "Accepted"
            ) {
                throw { message: "You have already responded to this request" };
            }

            if (approved === "Rejected") {
                await mutation.update(
                    { approved: "Rejected" },
                    {
                        where: {
                            id: mutationExist.id,
                        },
                    }
                );
                res.status(200).send({
                    message: "Request Sucessfully Rejected",
                });
            } else {
                await mutation.update(
                    { approved: "Accepted" },
                    {
                        where: {
                            id: mutationExist.id,
                        },
                    }
                );

                const productStockFromApproval = await productLocation.findOne({
                    where: {
                        product_id: mutationExist.product_id,
                        warehouse_location_id:
                            mutationExist.warehouse_approve_id,
                    },
                });

                const productStockFromReq = await productLocation.findOne({
                    where: {
                        product_id: mutationExist.product_id,
                        warehouse_location_id: mutationExist.warehouse_req_id,
                    },
                });

                const updatedStockApproval =
                    productStockFromApproval.qty - parseInt(mutationExist.qty);
                const updatedStockReq =
                    productStockFromReq.qty + parseInt(mutationExist.qty);

                await productLocation.update(
                    {
                        qty: updatedStockApproval,
                    },
                    {
                        where: {
                            id: productStockFromApproval.id,
                        },
                    }
                );

                await productLocation.update(
                    {
                        qty: updatedStockReq,
                    },
                    {
                        where: {
                            id: productStockFromReq.id,
                        },
                    }
                );

                //journal untuk warehouse yang request
                await journal.create({
                    journal_date: new Date(),
                    type: "Stock Mutation",
                    increment_change: mutationExist.qty,
                    decrement_change: 0,
                    total_qty_before: productStockFromReq.qty,
                    new_total_qty: updatedStockReq,
                    description: "Stock Mutation",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    product_id: mutationExist.product_id,
                    warehouse_location_id:
                        productStockFromReq.warehouse_location_id,
                });

                //journal untuk warehouse yang approve
                await journal.create({
                    journal_date: new Date(),
                    type: "Stock Mutation",
                    increment_change: 0,
                    decrement_change: mutationExist.qty,
                    total_qty_before: productStockFromApproval.qty,
                    new_total_qty: updatedStockApproval,
                    description: "Stock Mutation",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    product_id: mutationExist.product_id,
                    warehouse_location_id:
                        productStockFromApproval.warehouse_location_id,
                });

                res.status(200).send("Request Sucessfully Accepted");
            }
        } catch (error) {
            res.status(400).send({
                status: false,
                message: error.message,
            });
        }
    },
};
