'use strict';

export default function(sequelize, DataTypes) {
  return sequelize.define('Country', {
    _id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    countryName: DataTypes.STRING,
    countryCode: DataTypes.STRING,
    active: DataTypes.BOOLEAN
  });
}
