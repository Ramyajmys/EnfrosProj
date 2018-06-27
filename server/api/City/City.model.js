'use strict';

export default function(sequelize, DataTypes) {
  return sequelize.define('City', {
    _id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    cityName : {
      type: DataTypes.STRING,
      require: true
    },
    active: DataTypes.BOOLEAN
  });
}
