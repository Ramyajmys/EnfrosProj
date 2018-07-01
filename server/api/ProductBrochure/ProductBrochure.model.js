'use strict';

export default function(sequelize, DataTypes) {
  return sequelize.define('ProductBrochure', {
    _id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    brochure_name: DataTypes.STRING,
    path: DataTypes.STRING
  });
}
