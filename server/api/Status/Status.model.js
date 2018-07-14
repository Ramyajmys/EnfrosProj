'use strict';

export default function(sequelize, DataTypes) {
  return sequelize.define('Status', {
    _id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    status_name: DataTypes.STRING,
    status_info: DataTypes.STRING,
    active: DataTypes.BOOLEAN
  });
}
