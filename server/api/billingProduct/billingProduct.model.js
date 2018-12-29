'use strict';

export default function(sequelize, DataTypes) {
  return sequelize.define('BillingProduct', {
    _id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    product_name: DataTypes.STRING,
    product_description: DataTypes.STRING,
    capacity: DataTypes.STRING
  });
}
