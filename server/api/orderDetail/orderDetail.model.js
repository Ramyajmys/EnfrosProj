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
    product_name: DataTypes.STRING,
    unitprice: DataTypes.DECIMAL,
    quantity: DataTypes.BIGINT,
    product_total: DataTypes.DECIMAL,
    // product_discount: DataTypes.DECIMAL,
    cgst: DataTypes.DECIMAL,
    sgst: DataTypes.DECIMAL,
    igst: DataTypes.DECIMAL,
    active: DataTypes.BOOLEAN
  });
}
