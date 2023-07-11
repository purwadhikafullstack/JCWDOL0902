"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class stock_journal extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            this.belongsTo(models.product, {
                foreignKey: "product_id",
            });
            this.belongsTo(models.warehouse_location, {
                foreignKey: "warehouse_location_id",
            });
        }
    }
    stock_journal.init(
        {
            journal_date: {
                type: DataTypes.DATEONLY,
                defaultValue: DataTypes.NOW,
            },
            type: DataTypes.STRING,
            increment_change: DataTypes.INTEGER,
            decrement_change: DataTypes.INTEGER,
            total_qty_before: DataTypes.INTEGER,
            new_total_qty: DataTypes.INTEGER,
            description: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "stock_journal",
        }
    );
    return stock_journal;
};
