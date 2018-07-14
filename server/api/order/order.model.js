'use strict';

export default function(sequelize, DataTypes) {
  return sequelize.define('Order', {
    _id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    order_name: DataTypes.STRING,
    order_date: DataTypes.DATE,
    ship_date: DataTypes.DATE,
    delivery_date: DataTypes.DATE,
    payment_date: DataTypes.DATE,
    total: DataTypes.BIGINT,
    discount: DataTypes.INTEGER,
    active: DataTypes.BOOLEAN,
    paid_flag: DataTypes.BOOLEAN
  });
}
