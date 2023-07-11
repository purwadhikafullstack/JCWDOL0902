"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class transaction_item extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            this.belongsTo(models.product_location, {
                foreignKey: "product_location_id",
            });
            this.belongsTo(models.transaction, {
                foreignKey: "transaction_id",
            });
        }
    }
    transaction_item.init(
        {
            qty: DataTypes.INTEGER,
            price: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: "transaction_item",
            timestamps: false,
        }
    );
    return transaction_item;
};
