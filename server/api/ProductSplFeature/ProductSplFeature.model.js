'use strict';

export default function(sequelize, DataTypes) {
  return sequelize.define('ProductSplFeature', {
    _id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    feature_name: DataTypes.STRING
  });
}
