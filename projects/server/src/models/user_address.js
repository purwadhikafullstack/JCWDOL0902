'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class user_address extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            this.belongsTo(models.user, {
                foreignKey: 'user_id',
            });
            this.hasOne(models.transaction, {
                foreignKey: 'user_address_id',
            });
        }
    }
    user_address.init(
        {
            receiver_name: DataTypes.STRING,
            user_address: DataTypes.STRING,
            province: DataTypes.STRING,
            province_id: DataTypes.INTEGER,
            city: DataTypes.STRING,
            city_id: DataTypes.INTEGER,
            latitude: DataTypes.STRING,
            longitude: DataTypes.STRING,
            default_address: DataTypes.BOOLEAN,
        },
        {
            sequelize,
            modelName: 'user_address',
        }
    );
    return user_address;
};
