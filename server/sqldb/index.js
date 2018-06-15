/**
 * Sequelize initialization module
 */

'use strict';

import path from 'path';
import config from '../config/environment';
import Sequelize from 'sequelize';

var db = {
  Sequelize,
  sequelize: new Sequelize(config.sequelize.uri, config.sequelize.options)
};

// Insert models below
db.ProductSubCategory = db.sequelize.import('../api/ProductSubCategory/ProductSubCategory.model');
db.ProductCategory = db.sequelize.import('../api/ProductCategory/ProductCategory.model');
db.Thing = db.sequelize.import('../api/thing/thing.model');
db.User = db.sequelize.import('../api/user/user.model');

db.ProductCategory.hasMany(db.ProductSubCategory, {
  foreignKey: {
    name: 'category_id',
  }
});
db.ProductSubCategory.belongsTo(db.ProductCategory, {
  foreignKey: {
    name: 'category_id',
  }
});

module.exports = db;
