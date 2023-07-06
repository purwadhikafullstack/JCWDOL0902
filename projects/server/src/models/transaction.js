"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class transaction extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            this.belongsTo(models.order_status, {
                foreignKey: "order_status_id",
            });
            this.belongsTo(models.user_address, {
                foreignKey: "user_address_id",
            });
            this.belongsTo(models.warehouse_location, {
                foreignKey: "warehouse_location_id",
            });
            this.belongsTo(models.user, {
                foreignKey: "user_id",
            });
            this.hasOne(models.transaction_item, {
                foreignKey: "transaction_id",
            });
        }
    }
    transaction.init(
        {
            id: {
                allowNull: false,
                autoIncrement: false,
                primaryKey: true,
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
            },
            shipping: DataTypes.INTEGER,
            shipping_method: DataTypes.STRING,
            courier: DataTypes.STRING,
            upload_payment: DataTypes.STRING,
            expired: DataTypes.DATEONLY,
            total_price: DataTypes.INTEGER,
            total_qty: DataTypes.INTEGER,
            transaction_date: {
                type: DataTypes.DATEONLY,
                defaultValue: DataTypes.NOW,
            },
        },
        {
            sequelize,
            modelName: "transaction",
            timestamps: false,
        }
    );
    return transaction;
};
