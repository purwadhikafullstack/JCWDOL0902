"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("stock_journals", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            journal_date: {
                type: Sequelize.DATE,
            },
            type: {
                type: Sequelize.STRING,
            },
            increment_change: {
                type: Sequelize.INTEGER,
            },
            decrement_change: {
                type: Sequelize.INTEGER,
            },
            total_qty_before_change: {
                type: Sequelize.INTEGER,
            },
            new_total_qty: {
                type: Sequelize.INTEGER,
            },
            description: {
                type: Sequelize.STRING,
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
        await queryInterface.dropTable("stock_journals");
    },
};
