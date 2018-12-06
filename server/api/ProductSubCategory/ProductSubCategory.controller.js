/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/ProductSubCategorys              ->  index
 * POST    /api/ProductSubCategorys              ->  create
 * GET     /api/ProductSubCategorys/:id          ->  show
 * PUT     /api/ProductSubCategorys/:id          ->  upsert
 * PATCH   /api/ProductSubCategorys/:id          ->  patch
 * DELETE  /api/ProductSubCategorys/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import {ProductCategory} from '../../sqldb';
import {ProductSubCategory} from '../../sqldb';

import {ProductDetail} from '../../sqldb';
import {ProductElectricalData} from '../../sqldb';
import {ProductMechanicalData} from '../../sqldb';
import {ProductSplFeature} from '../../sqldb';
import {ProductInputDcData} from '../../sqldb';
import {ProductOutputAcData} from '../../sqldb';
import {ProductKitsData} from '../../sqldb';
var fs = require('fs');

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if(entity) {
      return res.status(statusCode).json(entity);
    }
    return null;
  };
}

function patchUpdates(patches) {
  return function(entity) {
    try {
      // eslint-disable-next-line prefer-reflect
      jsonpatch.apply(entity, patches, /*validate*/ true);
    } catch(err) {
      return Promise.reject(err);
    }

    return entity.save();
  };
}

function removeEntity(res) {
  return function(entity) {
    if(entity) {
      return entity.destroy()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if(!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

// Gets a list of ProductSubCategorys
export function index(req, res) {
  return ProductSubCategory.findAll({include: [{model: ProductCategory}]})
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single ProductSubCategory from the DB
export function show(req, res) {
  return ProductSubCategory.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single ProductSubCategory from the DB
export function getsubcategory(req, res) {
  return ProductSubCategory.findAll({
    where: {
      category_id: req.body.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new ProductSubCategory in the DB
export function create(req, res) {
  return ProductSubCategory.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Upserts the given ProductSubCategory in the DB at the specified ID
export function upsert(req, res) {
 
  return ProductSubCategory.update(req.body, {
    where: {
      _id: req.body._id
    }
  })
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing ProductSubCategory in the DB
export function patch(req, res) {
  if(req.body._id) {
    Reflect.deleteProperty(req.body, '_id');
  }
  return ProductSubCategory.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a ProductSubCategory from the DB
export function destroy(req, res) {
  return ProductSubCategory.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));

    // var sub_id = req.params.id;

    // return ProductDetail.find({where: {sub_category_id: sub_id}}).then(function(product) {
    //   var id = product._id;
    //   if(product.brochure != null) {
    //     var mode = process.env.NODE_ENV;
    //     var fPath;
    //     if(mode == 'development') {
    //       fPath = 'client/';
    //     } else if(mode == 'production') {
    //       fPath = 'dist/client/';
    //     }  
    //     fPath = fPath + product.brochure;
    //     if (fs.existsSync(fPath)) {
    //       fs.unlinkSync(fPath);
    //     } 
    //   } 
    //   if(product.category_id == 2) {
    //     var eres = ProductElectricalData.destroy({where: {product_detail_id: id}});
    //     var mres = ProductMechanicalData.destroy({where: {product_detail_id: id}});
    //     var fres = ProductSplFeature.destroy({where: {product_detail_id: id}});
    //     if(eres && mres && fres) {
    //       ProductDetail.destroy({where: {_id: id}}).then(function(deleted) {
    //         if(deleted) {
    //           ProductSubCategory.destroy({where: {_id: id}}).then(function() {
    //             return res.status(204).json({message: 'Successfully Deleted'})
    //           })
    //         }
    //       })
    //     }
    //   }
    //   if(product.category_id == 3) {
    //     var eres = ProductInputDcData.destroy({where: {product_detail_id: id}});
    //     var mres = ProductOutputAcData.destroy({where: {product_detail_id: id}});
    //     var fres = ProductSplFeature.destroy({where: {product_detail_id: id}});
    //     if(eres && mres && fres) {
    //       ProductDetail.destroy({where: {_id: id}}).then(function(deleted) {
    //         if(deleted) {
    //           ProductSubCategory.destroy({where: {_id: id}}).then(function() {
    //             return res.status(204).json({message: 'Successfully Deleted'})
    //           })
    //         }
    //       })
    //     }
    //   }
    //   if(product.category_id == 4) {
    //     var eres = ProductKitsData.destroy({where: {product_detail_id: id}});
    //     var fres = ProductSplFeature.destroy({where: {product_detail_id: id}});
    //     if(eres && fres) {
    //       ProductDetail.destroy({where: {_id: id}}).then(function(deleted) {
    //         if(deleted) {
    //           ProductSubCategory.destroy({where: {_id: id}}).then(function() {
    //             return res.status(204).json({message: 'Successfully Deleted'})
    //           })
    //         }
    //       })
    //     }
    //   }
    //   if(product.category_id == 5) {
    //     var fres = ProductSplFeature.destroy({where: {product_detail_id: id}});
    //     if(fres) {
    //       ProductDetail.destroy({where: {_id: id}}).then(function(deleted) {
    //         if(deleted) {
    //           ProductSubCategory.destroy({where: {_id: sub_id}}).then(function() {
    //             return res.status(204).json({message: 'Successfully Deleted'})
    //           })
    //         }
    //       })
    //     }
    //   }
    // })
    // .then(handleEntityNotFound(res))
    // .catch(handleError(res));
}
