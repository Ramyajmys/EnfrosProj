'use strict';

export default function(sequelize, DataTypes) {
  return sequelize.define('PurchaseEntries', {
    _id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    supplier_name: DataTypes.STRING,
    quantity: DataTypes.BIGINT,
    purchase_price: DataTypes.STRING,
    payment_status: DataTypes.STRING,
    file: DataTypes.BLOB,
    filetype: DataTypes.STRING,
    filename: DataTypes.STRING
  });
}
