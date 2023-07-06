"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class order_status extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            this.hasOne(models.transaction, {
                foreignKey: "order_status_id",
            });
        }
    }
    order_status.init(
        {
            status: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "order_status",
            timestamps: false,
        }
    );
    return order_status;
};
