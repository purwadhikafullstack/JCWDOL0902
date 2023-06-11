"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class product extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            this.hasOne(models.warehouse_mutation, {
                foreignKey: "product_id",
            });
            this.belongsTo(models.category, {
                foreignKey: "category_id",
            });
            this.belongsTo(models.user, {
                foreignKey: "user_id",
            });
            this.hasMany(models.product_location, {
                foreignKey: "product_id",
            });
            this.hasMany(models.cart, {
                foreignKey: "product_id",
            });
            this.hasOne(models.stock_journal, {
                foreignKey: "product_id",
            });
        }
    }
    product.init(
        {
            name: DataTypes.STRING,
            description: DataTypes.TEXT,
            product_image: DataTypes.STRING,
            price: DataTypes.INTEGER,
            stock: DataTypes.INTEGER,
            weight: DataTypes.INTEGER,
            brand: DataTypes.STRING,
            is_active: DataTypes.BOOLEAN,
        },
        {
            sequelize,
            modelName: "product",
        }
    );
    return product;
};
