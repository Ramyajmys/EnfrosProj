'use strict';

export default function(sequelize, DataTypes) {
  return sequelize.define('OrderDetail', {
    _id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    order_name: DataTypes.STRING,
    quantity: DataTypes.BIGINT,
    product_total: DataTypes.BIGINT,
    product_discount: DataTypes.INTEGER,
    active: DataTypes.BOOLEAN
  });
}
