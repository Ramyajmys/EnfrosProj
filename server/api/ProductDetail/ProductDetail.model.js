'use strict';

export default function(sequelize, DataTypes) {
  return sequelize.define('ProductDetail', {
    _id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    product_name: DataTypes.STRING,
    product_description: DataTypes.STRING,
    product_photo: DataTypes.TEXT,
    file: DataTypes.BLOB,
    filetype: DataTypes.STRING,
    filename: DataTypes.STRING
  });
}
