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
db.OrderDetail = db.sequelize.import('../api/orderDetail/orderDetail.model');
db.Order = db.sequelize.import('../api/order/order.model');
db.Status = db.sequelize.import('../api/Status/Status.model');
db.ProductKeyNote = db.sequelize.import('../api/ProductKeyNote/ProductKeyNote.model');
db.ProductSplFeature = db.sequelize.import('../api/ProductSplFeature/ProductSplFeature.model');
db.ProductBrochure = db.sequelize.import('../api/ProductBrochure/ProductBrochure.model');
db.ProductMechanicalData = db.sequelize.import('../api/ProductMechanicalData/ProductMechanicalData.model');
db.ProductElectricalData = db.sequelize.import('../api/ProductElectricalData/ProductElectricalData.model');
db.HSN = db.sequelize.import('../api/HSN/HSN.model');
db.ProductDetail = db.sequelize.import('../api/ProductDetail/ProductDetail.model');
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

// product details association
db.ProductDetail.belongsTo(db.ProductCategory, {
  foreignKey: {
    name: 'category_id',
    allowNull: false
  }
});
db.ProductCategory.hasMany(db.ProductDetail, {
  foreignKey: {
    name: 'category_id',
    allowNull: false
  }
});
db.ProductDetail.belongsTo(db.ProductSubCategory, {
  foreignKey: {
    name: 'sub_category_id',
    allowNull: false
  }
});
db.ProductSubCategory.hasMany(db.ProductDetail, {
  foreignKey: {
    name: 'sub_category_id',
    allowNull: false
  }
});
db.ProductDetail.belongsTo(db.HSN, {
  foreignKey: {
    name: 'hsn_id',
    allowNull: false
  }
});
db.HSN.hasMany(db.ProductDetail, {
  foreignKey: {
    name: 'hsn_id'
  }
})

// product electrical data association
db.ProductElectricalData.belongsTo(db.ProductDetail, {
  foreignKey: {
    name: 'product_detail_id'
  }
});
db.ProductDetail.hasMany(db.ProductElectricalData, {
  foreignKey: {
    name: 'product_detail_id'
  }
});

// product mechanical data association
db.ProductMechanicalData.belongsTo(db.ProductDetail, {
  foreignKey: {
    name: 'product_detail_id'
  }
});
db.ProductDetail.hasMany(db.ProductMechanicalData, {
  foreignKey: {
    name: 'product_detail_id'
  }
});

// product brochure association
db.ProductBrochure.belongsTo(db.ProductDetail, {
  foreignKey: {
    name: 'product_detail_id'
  }
});
db.ProductDetail.hasMany(db.ProductBrochure, {
  foreignKey: {
    name: 'product_detail_id'
  }
});

// spl feature association
db.ProductSplFeature.belongsTo(db.ProductDetail, {
  foreignKey: {
    name: 'product_detail_id'
  }
});
db.ProductDetail.hasMany(db.ProductSplFeature, {
  foreignKey: {
    name: 'product_detail_id'
  }
});

// product key note association
db.ProductKeyNote.belongsTo(db.ProductDetail, {
  foreignKey: {
    name: 'product_detail_id'
  }
});
db.ProductDetail.hasMany(db.ProductKeyNote, {
  foreignKey: {
    name: 'product_detail_id'
  }
});


// Order details association
//db.ProductDetails.belongsTo(db.OrderDetail, {
//  foreignKey: {
//    name: 'product_detail_id'
//  }
//});
//db.OrderDetail.hasMany(db.ProductDetails, {
//  foreignKey: {
//    name: 'product_detail_id'
//  }
//});

// Order association with status and Order Details
db.OrderDetail.belongsTo(db.Order, {
  foreignKey: {
    name: 'order_detail_id'
  }
});
db.Order.hasMany(db.OrderDetail, {
  foreignKey: {
    name: 'order_detail_id'
  }
});

db.Status.belongsTo(db.Order, {
  foreignKey: {
    name: 'status'
  }
});
db.Order.hasMany(db.Status, {
  foreignKey: {
    name: 'status'
  }
});

module.exports = db;
