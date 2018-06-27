'use strict';

export default function(sequelize, DataTypes) {
  return sequelize.define('Role', {
    _id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    roleName: DataTypes.STRING,
    active: DataTypes.BOOLEAN
  });
}
