"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("transactions", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            shipping: {
                type: Sequelize.INTEGER,
            },
            shipping_method: {
                type: Sequelize.STRING,
            },
            courier: {
                type: Sequelize.STRING,
            },
            upload_payment: {
                type: Sequelize.STRING,
            },
            expired: {
                type: Sequelize.DATE,
            },
            total_price: {
                type: Sequelize.INTEGER,
            },
            total_qty: {
                type: Sequelize.INTEGER,
            },
            transaction_date: {
                type: Sequelize.DATE,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("transactions");
    },
};
