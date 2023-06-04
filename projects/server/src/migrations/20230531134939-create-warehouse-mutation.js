"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("warehouse_mutations", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            request: {
                type: Sequelize.STRING,
            },
            approve_by: {
                type: Sequelize.STRING,
            },
            approved: {
                type: Sequelize.BOOLEAN,
            },
            qty: {
                type: Sequelize.INTEGER,
            },
            remarks: {
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
        await queryInterface.dropTable("warehouse_mutations");
    },
};
