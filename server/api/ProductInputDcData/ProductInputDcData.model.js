'use strict';

export default function(sequelize, DataTypes) {
  return sequelize.define('ProductInputDcData', {
    _id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    model: DataTypes.STRING,
    max_power: DataTypes.STRING,
    voltage: DataTypes.STRING,
    mpp_voltage: DataTypes.STRING,
    startup_voltage: DataTypes.STRING,
    input_current: DataTypes.STRING,
    active: DataTypes.BOOLEAN
  });
}
