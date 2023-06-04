"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("user_addresses", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            user_address: {
                type: Sequelize.STRING,
            },
            subdistrict: {
                type: Sequelize.STRING,
            },
            city: {
                type: Sequelize.STRING,
            },
            province: {
                type: Sequelize.STRING,
            },
            latitude: {
                type: Sequelize.STRING,
            },
            longtitude: {
                type: Sequelize.STRING,
            },
            receiver_name: {
                type: Sequelize.STRING,
            },
            phone_number: {
                type: Sequelize.STRING,
            },
            default_address: {
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
        await queryInterface.dropTable("user_addresses");
    },
};
