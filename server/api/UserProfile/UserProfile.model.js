'use strict';

export default function(sequelize, DataTypes) {
  return sequelize.define('UserProfile', {
    _id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    gst_number: DataTypes.STRING,
    address: DataTypes.STRING,
    zip: DataTypes.STRING,
    profilepic: DataTypes.TEXT,
    shippingAdress: DataTypes.BOOLEAN,
    active: DataTypes.BOOLEAN
  });
}
