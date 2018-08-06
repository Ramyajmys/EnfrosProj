'use strict';

export default function(sequelize, DataTypes) {
  return sequelize.define('ProductBatteryData', {
    _id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    voltage: DataTypes.STRING,
    capacity: DataTypes.STRING,
    weight: DataTypes.STRING,
    length: DataTypes.STRING,
    width: DataTypes.STRING,
    height: DataTypes.STRING,
    active: DataTypes.BOOLEAN
  });
}
