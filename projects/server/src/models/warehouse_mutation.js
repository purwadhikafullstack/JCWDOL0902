"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class warehouse_mutation extends Model {
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
                foreignKey: "warehouse_req_id",
            });
            this.belongsTo(models.warehouse_location, {
                foreignKey: "warehouse_approve_id",
            });
        }
    }
    warehouse_mutation.init(
        {
            request: DataTypes.STRING,
            approve_by: DataTypes.STRING,
            approved: DataTypes.BOOLEAN,
            qty: DataTypes.INTEGER,
            remarks: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "warehouse_mutation",
        }
    );
    return warehouse_mutation;
};
