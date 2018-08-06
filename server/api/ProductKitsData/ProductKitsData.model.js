'use strict';

export default function(sequelize, DataTypes) {
  return sequelize.define('ProductKitsData', {
    _id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    peak_power_kilowats: DataTypes.BIGINT,
    panel_cell: DataTypes.STRING,
    ac_wire: DataTypes.STRING,
    dc_wire: DataTypes.STRING,
    cable: DataTypes.STRING,
    inverter_phase: DataTypes.STRING,
    active: DataTypes.BOOLEAN
  });
}
