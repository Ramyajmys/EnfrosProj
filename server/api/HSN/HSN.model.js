'use strict';

export default function(sequelize, DataTypes) {
  return sequelize.define('HSN', {
    _id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    hsn_code: DataTypes.STRING,
    hsn_percentage: DataTypes.INTEGER,
    active: DataTypes.BOOLEAN
  });
}
