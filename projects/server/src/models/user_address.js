"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class user_address extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            this.hasMany(models.user, {
                foreignKey: "user_address_id",
            });
            this.hasOne(models.transaction, {
                foreignKey: "user_address_id",
            });
        }
    }
    user_address.init(
        {
            user_address: DataTypes.STRING,
            subdistrict: DataTypes.STRING,
            city: DataTypes.STRING,
            province: DataTypes.STRING,
            latitude: DataTypes.STRING,
            longitude: DataTypes.STRING,
            receiver_name: DataTypes.STRING,
            phone_number: DataTypes.STRING,
            default_address: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "user_address",
        }
    );
    return user_address;
};
