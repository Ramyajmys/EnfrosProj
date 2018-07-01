'use strict';

export default function(sequelize, DataTypes) {
  return sequelize.define('ProductMechanicalData', {
    _id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    solar_cell: DataTypes.STRING,
    cell_orientation: DataTypes.STRING,
    module_dimensions: DataTypes.STRING,
    weight: DataTypes.STRING,
    glass: DataTypes.STRING
  });
}
