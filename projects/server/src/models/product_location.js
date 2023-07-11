"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class product_location extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            this.belongsTo(models.warehouse_location, {
                foreignKey: "warehouse_location_id",
            });
            this.hasOne(models.transaction_item, {
                foreignKey: "product_location_id",
            });
            this.belongsTo(models.product, {
                foreignKey: "product_id",
            });
        }
    }
    product_location.init(
        {
            qty: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: "product_location",
        }
    );
    return product_location;
};
