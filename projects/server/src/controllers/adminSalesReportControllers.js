const db = require("../models");
const { Op } = require("sequelize");
const moment = require("moment");

const transaction = db.transaction;
const transaction_item = db.transaction_item;
const product_location = db.product_location;
const warehouse_location = db.warehouse_location;
const product = db.product;
const category = db.category;

module.exports = {
    fetchTransactionData: async (req, res) => {
        try {
            const { month, categorie, wrId, search_query, id, role, page } =
                req.query;
            const whichCategorie = categorie || "";
            const whichMonth = !month
                ? "01"
                : month < 10
                ? "0" + month
                : month || "0";
            const whichwarehouse = wrId || "";
            const search = search_query || "";

            let thisMoment = moment().format(
                `${moment().year()}-${whichMonth}-01`
            );
            let endOfMonth = moment(thisMoment).endOf("month").toDate();
            let startOfMonth = moment(thisMoment).startOf("month").toDate();
            if (+role === 3) {
                const page_list = +page || 0;
                const limit_list = 10;
                const totalRows = await transaction.count({
                    where: { order_status_id: 5 },
                });
                const offset = limit_list * page_list;
                const totalPage = Math.ceil(totalRows / limit_list);

                const allSales = await transaction.findAll({
                    where: {
                        order_status_id: 5,
                        transaction_date: month
                            ? { [Op.between]: [startOfMonth, endOfMonth] }
                            : { [Op.not]: null },
                    },
                    having: {
                        ["transaction_item.product_location.product.category.id"]:
                            whichCategorie
                                ? whichCategorie
                                : { [Op.not]: null },
                        ["transaction_item.product_location.warehouse_location.id"]:
                            whichwarehouse
                                ? whichwarehouse
                                : { [Op.not]: null },
                        ["transaction_item.product_location.product.name"]: {
                            [Op.like]: "%" + search + "%",
                        },
                    },
                    include: [
                        {
                            model: transaction_item,
                            include: [
                                {
                                    model: product_location,
                                    include: [
                                        {
                                            model: product,
                                            include: [{ model: category }],
                                        },
                                        { model: warehouse_location },
                                    ],
                                },
                            ],
                        },
                    ],
                    offset: offset,
                    limit: limit_list,
                    subQuery: false,
                });

                let totalSales = [];
                let price = allSales.map((item) => {
                    return item.transaction_item.product_location.product.price;
                });

                console.log(price);

                let cleanprice = price.flat(1);
                let quantity = allSales.map((item) => {
                    return item.transaction_item.product_location.qty;
                });
                let cleanqty = quantity.flat(1);
                for (let i = 0; i < cleanprice.length; i++) {
                    totalSales.push(cleanprice[i] * cleanqty[i]);
                }
                let cleantotalSales = totalSales.reduce((a, b) => a + b, 0);
                return res.status(200).send({
                    allSales,
                    cleantotalSales,
                    page: page_list,
                    limit: limit_list,
                    totalRows: totalRows,
                    totalPage: totalPage,
                    offset: offset,
                });
            }

            if (+role === 2) {
                const adminId = +id || "";
                const warehouseBranch = await warehouse_location.findOne({
                    where: { user_id: adminId },
                });
                const page_list = +page || 0;
                const limit_list = 10;
                const totalRows = await transaction.count({
                    where: { order_status_id: 5 },
                });
                const offset = limit_list * page_list;
                const totalPage = Math.ceil(totalRows / limit_list);

                const branchSales = await transaction.findAll({
                    where: {
                        order_status_id: 5,
                        transaction_date: month
                            ? { [Op.between]: [startOfMonth, endOfMonth] }
                            : { [Op.not]: null },
                    },
                    having: {
                        ["transaction_item.product_location.product.category.id"]:
                            whichCategorie
                                ? whichCategorie
                                : { [Op.not]: null },
                        ["transaction_item.product_location.warehouse_location.id"]:
                            warehouseBranch.id,
                        ["transaction_item.product_location.product.name"]: {
                            [Op.like]: "%" + search + "%",
                        },
                    },
                    include: [
                        {
                            model: transaction_item,
                            include: [
                                {
                                    model: product_location,
                                    include: [
                                        {
                                            model: product,
                                            include: [{ model: category }],
                                        },
                                        { model: warehouse_location },
                                    ],
                                },
                            ],
                        },
                    ],
                    offset: offset,
                    limit: limit_list,
                    subQuery: false,
                });
                let totalSales = [];
                let price = branchSales.map((item) => {
                    // console.log(
                    //   item.product_location,
                    //   "ini priceeeeeeeeeeeeeeeeeeeee"
                    // );
                    return item.transaction_item.product_location.product.price;
                });
                let cleanprice = price.flat(1);
                let quantity = branchSales.map((item) => {
                    return item.transaction_item.product_location.qty;
                });
                let cleanqty = quantity.flat(1);
                for (let i = 0; i < cleanprice.length; i++) {
                    totalSales.push(cleanprice[i] * cleanqty[i]);
                }
                let cleantotalSales = totalSales.reduce((a, b) => a + b, 0);
                return res.status(200).send({
                    allSales: branchSales,
                    cleantotalSales,
                    page: page_list,
                    limit: limit_list,
                    totalRows: totalRows,
                    totalPage: totalPage,
                });
            }
            return res.status(200).send("Sales Report");
        } catch (error) {
            res.status(400).send({
                status: false,
                message: error.message,
            });
        }
    },
};
