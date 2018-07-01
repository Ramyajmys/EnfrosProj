'use strict';

export default function(sequelize, DataTypes) {
  return sequelize.define('ProductDetail', {
    _id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    model_name: DataTypes.STRING,
    model_description: DataTypes.STRING,
    model_photo: DataTypes.TEXT,
    quantity: DataTypes.BIGINT,
    unitprice: DataTypes.BIGINT,
    discount: DataTypes.INTEGER,
    active: DataTypes.BOOLEAN
  });
}
