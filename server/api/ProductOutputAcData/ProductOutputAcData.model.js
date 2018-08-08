'use strict';

export default function(sequelize, DataTypes) {
  return sequelize.define('ProductOutputAcData', {
    _id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    model: DataTypes.STRING,
    output_power: DataTypes.STRING,
    frequency: DataTypes.STRING,
    active: DataTypes.BOOLEAN
  });
}
