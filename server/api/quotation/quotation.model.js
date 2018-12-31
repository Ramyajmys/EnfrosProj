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
    file: DataTypes.BLOB,
    active: DataTypes.BOOLEAN
  });
}
