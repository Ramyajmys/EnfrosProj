'use strict';

export default function(sequelize, DataTypes) {
  return sequelize.define('State', {
    _id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    stateName : {
      type: DataTypes.STRING,
      require: true
    },
    active: DataTypes.BOOLEAN
  });
}
