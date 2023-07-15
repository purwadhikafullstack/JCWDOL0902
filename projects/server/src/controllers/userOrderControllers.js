const { Sequelize } = require("sequelize");

//import model
const db = require("../models");
const cart = db.cart;
const user = db.user;
const user_address = db.user_address;
const product = db.product;
const product_location = db.product_location;
const transaction = db.transaction;
const transaction_item = db.transaction_item;
const warehouse_location = db.warehouse_location;
const stock_journal = db.stock_journal;

module.exports = {
    fetchCart: async (req, res) => {
        try {
            // Fetch cart data
            const userData = dataToken;
            let cartData = await cart.findAll({
                include: [{ model: product }],
                where: { user_id: userData.id },
            });

            // Check if cart qty exceed available product
            cartData.forEach(async (cartData) => {
                if (cartData.qty > cartData.product.stock) {
                    await cart.update(
                        {
                            qty: cartData.product.stock,
                        },
                        {
                            where: {
                                user_id: cartData.user_id,
                                product_id: cartData.product_id,
                            },
                        }
                    );
                }
            });
            // Refetch after update invalid cart qty
            cartData = await cart.findAll({
                include: [{ model: product }],
                where: { user_id: userData.id },
            });

            // Send response
            res.status(200).send({
                status: true,
                cartData,
            });
        } catch (error) {
            res.status(500).send({
                status: false,
                message: error.message,
            });
        }
    },
    addProductToCart: async (req, res) => {
        try {
            // Check registered/verified user
            const userVerified = await user.findOne({
                where: { id: req.params.id },
            });
            console.log(userVerified);
            if (!userVerified || userVerified.is_verified !== true) {
                throw {
                    message: "Please Login or Verify Your Account First!",
                };
            }

            // Check product data stock
            const { product_id, addedQty } = req.body;
            const productData = await product.findOne({
                where: { id: product_id },
            });

            // Check product stock
            if (productData.stock < 1) {
                throw {
                    message: "Out of Stock!",
                };
            }

            // Check product already existed in cart
            const productExisted = await cart.findOne({
                where: { user_id: req.params.id, product_id },
            });
            if (productExisted) {
                // Check maximum qty of available products
                if (productExisted.qty + addedQty > productData.stock) {
                    throw {
                        message: "Maximum Quantity of Available Products!",
                    };
                }
                // Add to existing cart
                await cart.update(
                    {
                        qty: Sequelize.literal(`qty + ${addedQty}`),
                        updatedAt: new Date(),
                    },
                    {
                        where: { user_id: req.params.id, product_id },
                    }
                );
            } else {
                // Check maximum qty of available products
                if (addedQty > productData.stock) {
                    throw {
                        message: "Maximum Quantity of Available Products!",
                    };
                }
                // Create new product in cart
                await cart.create({
                    qty: addedQty,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    product_id,
                    user_id: req.params.id,
                });
            }

            // Send response
            res.status(200).send({
                status: true,
                message: "Product added to cart!",
            });
        } catch (error) {
            res.status(500).send({
                status: false,
                message: error.message,
            });
        }
    },
    editProductCartQty: async (req, res) => {
        try {
            // Check product data stock
            const { product_id, newQty } = req.body;

            // Update cart qty
            await cart.update(
                {
                    qty: newQty,
                    updatedAt: new Date(),
                },
                {
                    where: { user_id: req.params.id, product_id },
                }
            );

            // Send response
            res.status(200).send({
                status: true,
                message: "Product added to cart!",
            });
        } catch (error) {
            res.status(500).send({
                status: false,
                message: error.message,
            });
        }
    },
    removeProductFromCart: async (req, res) => {
        try {
            const { product_id } = req.body;

            await cart.destroy({
                where: {
                    user_id: req.params.id,
                    product_id,
                },
            });

            res.status(200).send({
                status: true,
                message: "Product Successfuly Removed!",
            });
        } catch (error) {
            res.status(400).send({
                status: false,
                message: error.message,
            });
        }
    },
    getNearestWarehouse: async (req, res) => {
        try {
            // find lat lng warehouse origin
            const originUser = await user_address.findOne({
                where: {
                    user_id: req.params.id,
                    default_address: 1,
                },
            });

            const originLat = originUser.latitude;
            const originLng = originUser.longitude;

            function calCrow(lat1, lon1, lat2, lon2) {
                var R = 6371; // km
                var dLat = toRad(lat2 - lat1);
                var dLon = toRad(lon2 - lon1);
                var lat1 = toRad(lat1);
                var lat2 = toRad(lat2);

                var a =
                    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                    Math.sin(dLon / 2) *
                        Math.sin(dLon / 2) *
                        Math.cos(lat1) *
                        Math.cos(lat2);
                var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                var d = R * c;
                return d;
            }

            function toRad(value) {
                return (value * Math.PI) / 180;
            }

            // find closest warehouses
            const closestWarehouse = await warehouse_location.findAll();

            const nearestOne = [];
            for (let i = 0; i < closestWarehouse.length; i++) {
                const nearestWarehouse = calCrow(
                    originLat,
                    originLng,
                    closestWarehouse[i].latitude,
                    closestWarehouse[i].longitude
                );

                nearestOne.push({
                    warehouse: closestWarehouse[i],
                    range: nearestWarehouse,
                });
            }

            const warehouseSort = nearestOne
                .sort((a, b) => a.range - b.range)
                .map((value) => value.warehouse);

            // const warehouseSort = "Hello";

            res.status(200).send({
                status: true,
                message: "Success",
                origin: warehouseSort,
            });
        } catch (error) {
            res.status(400).send({
                status: false,
                message: error.message,
            });
        }
    },
    createOrder: async (req, res) => {
        try {
            // di FrontEnd -> countdown dari expiredAt ke new Date
            // Di dashboard, ada pengecekan untuk new date() dan expiredAt.
            // Jika pembayaran sudah expired, admin bisa cancel order/transaction

            const {
                shipping_price,
                shipping_method,
                courier,
                nearestWarehouse_id,
                total_price,
                total_qty,
                user_address_id,
            } = req.body;

            // Get cart details
            const Item = await cart.findAll({
                where: { user_id: req.params.id },
                include: [
                    { model: product },
                    {
                        model: user,
                        include: [{ model: user_address }],
                    },
                ],
            });

            // Set expired at 1 hour
            const expired = new Date(Date.now() + 2 * 60 * 60 * 1000);

            // Create Transaction
            const createOrder = await transaction.create({
                shipping: shipping_price,
                shipping_method,
                courier,
                upload_payment: null,
                expired,
                total_price,
                total_qty,
                transaction_date: new Date(),
                order_status_id: 1,
                user_address_id,
                warehouse_location_id: nearestWarehouse_id,
                user_id: req.params.id,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            // Create transaction_item
            const quantity = Item.map((item) => item.qty);
            const price = Item.map((item) => item.product.price);
            const product_id = Item.map((item) => item.product_id);
            const product_locations = await product_location.findAll({
                where: { warehouse_location_id: nearestWarehouse_id },
            });

            // update stock
            await Promise.all(
                product_id.map(async (productId, i) => {
                    const qtyBefore = product_locations.find(
                        (item) => item.product_id === productId
                    );
                    await stock_journal.create({
                        journal_date: new Date(),
                        type: "Sold",
                        increment_change: 0,
                        decrement_change: quantity[i],
                        total_qty_before: +qtyBefore.qty,
                        new_total_qty: +qtyBefore.qty - quantity[i],
                        description: "Sold",
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        product_id: productId,
                        warehouse_location_id: nearestWarehouse_id,
                    });
                    await product_location.decrement("qty", {
                        by: quantity[i],
                        where: {
                            product_id: productId,
                            warehouse_location_id: nearestWarehouse_id,
                        },
                    });
                    await product.decrement("stock", {
                        by: quantity[i],
                        where: { id: productId },
                    });
                })
            );

            for (let i = 0; i < product_id.length; i++) {
                await transaction_item.create({
                    qty: quantity[i],
                    price: price[i],
                    product_location_id: product_locations.filter(
                        (item) => item.product_id === product_id[i]
                    )[0].id,
                    transaction_id: createOrder.id,
                });
            }

            // Destory cart by cart id
            const cartDestroy = Item.map((item) => item.id);
            for (let i = 0; i < cartDestroy.length; i++) {
                await cart.destroy({
                    where: {
                        id: cartDestroy[i],
                    },
                });
            }

            console.log("SUCCESS");
            res.status(200).send({ status: true });
        } catch (error) {
            res.status(400).send({ message: error.message });
        }
    },
};
