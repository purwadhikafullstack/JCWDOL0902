"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("warehouse_locations", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            city: {
                type: Sequelize.STRING,
            },
            subdistrict: {
                type: Sequelize.STRING,
            },
            province: {
                type: Sequelize.STRING,
            },
            address: {
                type: Sequelize.STRING,
            },
            latitude: {
                type: Sequelize.STRING,
            },
            longitude: {
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
        await queryInterface.dropTable("warehouse_locations");
    },
};
