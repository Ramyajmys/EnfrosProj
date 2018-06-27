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
db.UserProfile = db.sequelize.import('../api/UserProfile/UserProfile.model');
db.Role = db.sequelize.import('../api/Role/Role.model');
db.City = db.sequelize.import('../api/City/City.model');
db.State = db.sequelize.import('../api/State/State.model');
db.Country = db.sequelize.import('../api/Country/Country.model');
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

//state association
db.State.belongsTo(db.Country, {
  foreignKey: {
    name: 'country_id'
  }
});
db.Country.hasMany(db.State, {
  foreignKey: {
    name: 'country_id'
  }
});

//city association
db.City.belongsTo(db.State, {
  foreignKey: {
    name: 'state_id'
  }
});
db.State.hasMany(db.City, {
  foreignKey: {
    name: 'state_id'
  }
});

//user association 
db.UserProfile.belongsTo(db.User, {
  foreignKey: {
    name: 'user_id',
    allowNull: false
  }
});
db.User.hasOne(db.UserProfile, {
  foreignKey: {
    name: 'user_id',
    allowNull: false
  }
});

// userprofile address association
db.UserProfile.belongsTo(db.Country, {
  foreignKey: {
    name: 'country_id'
  }
});
db.Country.hasMany(db.UserProfile, {
  foreignKey: {
    name: 'country_id'
  }
});
db.UserProfile.belongsTo(db.State, {
  foreignKey: {
    name: 'state_id'
  }
});
db.State.hasMany(db.UserProfile, {
  foreignKey: {
    name: 'state_id'
  }
});
db.UserProfile.belongsTo(db.City, {
  foreignKey: {
    name: 'city_id'
  }
});
db.City.hasMany(db.UserProfile, {
  foreignKey: {
    name: 'city_id'
  }
});

module.exports = db;
