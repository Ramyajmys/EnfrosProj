'use strict';

export default function(sequelize, DataTypes) {
  return sequelize.define('ProductKitsData', {
    _id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    peak_power_kilowats: DataTypes.STRING,
    solar_panel: DataTypes.STRING,
    inverter_phase: DataTypes.STRING,
    inverter_efficiency: DataTypes.STRING,
    dc_wire: DataTypes.STRING,
    ac_wire: DataTypes.STRING,
    cable: DataTypes.STRING,
    ajb: DataTypes.BOOLEAN,
    flat: DataTypes.BOOLEAN,
    monitoring: DataTypes.BOOLEAN,
    active: DataTypes.BOOLEAN
  });
}
