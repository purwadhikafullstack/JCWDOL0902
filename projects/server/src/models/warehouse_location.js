"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class warehouse_location extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            this.belongsTo(models.user, {
                foreignKey: "user_id",
            });
            this.hasMany(models.product_location, {
                foreignKey: "warehouse_location_id",
            });
            this.hasOne(models.warehouse_mutation, {
                foreignKey: "warehouse_req_id",
            });
            this.hasOne(models.warehouse_mutation, {
                foreignKey: "warehouse_approve_id",
            });
            this.hasOne(models.transaction, {
                foreignKey: "warehouse_location_id",
            });
            this.hasOne(models.stock_journal, {
                foreignKey: "warehouse_location_id",
            });
        }
    }
    warehouse_location.init(
        {
            warehouse_name: DataTypes.STRING,
            province: DataTypes.STRING,
            province_id: DataTypes.INTEGER,
            city: DataTypes.STRING,
            city_id: DataTypes.INTEGER,
            address: DataTypes.STRING,
            latitude: DataTypes.STRING,
            longitude: DataTypes.STRING,
            email: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "warehouse_location",
        }
    );
    return warehouse_location;
};
