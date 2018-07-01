'use strict';

export default function(sequelize, DataTypes) {
  return sequelize.define('ProductKeyNote', {
    _id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    key_note: DataTypes.STRING
  });
}
