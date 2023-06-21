const { Sequelize } = require("sequelize");

//import model
const db = require("../models");
const cart = db.cart;
const user = db.user;
const product = db.product;

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
                    message: "Please register or verify your account first!",
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
                    message: "Out of stock!",
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
};
