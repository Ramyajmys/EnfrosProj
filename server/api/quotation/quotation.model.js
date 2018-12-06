'use strict';

export default function(sequelize, DataTypes) {
  return sequelize.define('Quotation', {
    _id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    date: DataTypes.STRING,
    time: DataTypes.STRING,
    path: DataTypes.STRING,
    active: DataTypes.BOOLEAN
  });
}
