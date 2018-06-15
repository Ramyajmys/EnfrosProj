'use strict';

export default function(sequelize, DataTypes) {
  return sequelize.define('ProductSubCategory', {
    _id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    sub_category_name: DataTypes.STRING,
    sub_category_description: DataTypes.STRING,
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  });
}
