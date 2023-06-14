"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class user extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            this.hasMany(models.user_address, {
                foreignKey: "user_id",
            });
            this.hasOne(models.cart, {
                foreignKey: "user_id",
            });
            this.hasMany(models.transaction, {
                foreignKey: "user_id",
            });
            this.hasOne(models.product, {
                foreignKey: "user_id",
            });
            this.hasOne(models.warehouse_location, {
                foreignKey: "user_id",
            });
        }
    }
    user.init(
        {
            id: {
                allowNull: false,
                autoIncrement: false,
                primaryKey: true,
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
            },
            email: DataTypes.STRING,
            password: DataTypes.STRING,
            is_verified: DataTypes.BOOLEAN,
            role: DataTypes.INTEGER,
            name: DataTypes.STRING,
            phone_number: DataTypes.STRING,
            photo_profile: {
                type: DataTypes.STRING,
                defaultValue: "Public/images/default_avatar.jpg",
            },
        },
        {
            sequelize,
            modelName: "user",
        }
    );
    return user;
};
