'use strict';

export default function(sequelize, DataTypes) {
  return sequelize.define('ProductCategory', {
    _id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    category_name: DataTypes.STRING,
    category_description: DataTypes.STRING,
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  });
}
