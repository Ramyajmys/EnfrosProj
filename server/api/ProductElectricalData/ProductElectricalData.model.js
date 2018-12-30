'use strict';

export default function(sequelize, DataTypes) {
  return sequelize.define('ProductElectricalData', {
    _id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    peak_power_watts_pmax: DataTypes.STRING,
    maximum_power_voltage_vmpp: DataTypes.DECIMAL,
    maximum_power_current_impp: DataTypes.DECIMAL
  });
}
