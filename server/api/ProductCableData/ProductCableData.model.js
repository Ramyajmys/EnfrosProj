'use strict';

export default function(sequelize, DataTypes) {
  return sequelize.define('ProductCableData', {
    _id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    size_mm: DataTypes.STRING,
    diameter_mm: DataTypes.STRING,
    thickness_mm: DataTypes.STRING,
    nominal_mm: DataTypes.STRING,
    current: DataTypes.STRING,
    active: DataTypes.BOOLEAN
  });
}
