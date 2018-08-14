/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/ProductDetails              ->  index
 * POST    /api/ProductDetails              ->  create
 * GET     /api/ProductDetails/:id          ->  show
 * PUT     /api/ProductDetails/:id          ->  upsert
 * PATCH   /api/ProductDetails/:id          ->  patch
 * DELETE  /api/ProductDetails/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import {ProductDetail} from '../../sqldb';
import {ProductElectricalData} from '../../sqldb';
import {ProductMechanicalData} from '../../sqldb';
import {ProductSplFeature} from '../../sqldb';
import {ProductBrochure} from '../../sqldb';
import {ProductInputDcData} from '../../sqldb';
import {ProductOutputAcData} from '../../sqldb';
import {ProductKitsData} from '../../sqldb';
import {HSN} from '../../sqldb';
import {ProductCategory} from '../../sqldb';
import {ProductSubCategory} from '../../sqldb';

var base64 = require('file-base64');
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

// Gets a list of ProductDetails
export function index(req, res) {
  return ProductDetail.findAll({include: [{model: HSN}, {model: ProductCategory}, {model: ProductSubCategory}], order:[['_id', 'DESC']]})
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single ProductDetail from the DB
export function show(req, res) {
  return ProductDetail.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}
//Get Product Details for this category
export function getProductCategory(req, res) {
    return ProductDetail.findAll({
    where: {
      category_id: req.body.id
    },
    include: [{model: HSN}]
  })
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

//Get Product Details for this category
export function getProductsubCategory(req, res) {
  return ProductDetail.findAll({
  where: {
    category_id: req.body.cid, sub_category_id: req.body.sid
  },
  include: [{model: HSN}]
})
  .then(handleEntityNotFound(res))
  .then(respondWithResult(res))
  .catch(handleError(res));
}

// Creates a new ProductDetail in the DB
export function create(req, res) {
  var brochure = req.body.brochurefiles;

  if(req.body.category_id == 2) {
    return ProductDetail.create(req.body).then(function(prod) {
      if(prod) {
        if(req.body.e_data.length != 0) {
          var eObj, eRes, sObj, sRes, mRes;
          for(var i=0; i<req.body.e_data.length; i++) {
            eObj = req.body.e_data[i];
            eObj['product_detail_id'] = prod._id;
            eRes = ProductElectricalData.create(eObj);
          }
          for(var i=0; i<req.body.features.length; i++) {
            sObj = req.body.features[i];
            sObj['product_detail_id'] = prod._id;
            sRes = ProductSplFeature.create(sObj);
          }
          req.body.m_data.product_detail_id = prod._id;
          mRes = ProductMechanicalData.create(req.body.m_data);
  
          if(eRes && sRes && mRes) {
            var base64String = brochure.base64;
            var filepath = './assets/brochure/'+prod._id+brochure.filename;
            var path = './client/assets/brochure/'+prod._id+brochure.filename;
            base64.decode(base64String, path, function(err, output) {
              ProductDetail.update({brochure: filepath}, {where: {_id: prod._id}}).then(function() {
                return res.status(200).json({message: "Product sucessfully added"})
              })
              .catch(handleError(res));
            });
          }
        }
      }
    })
    .catch(handleError(res));
  }

  if(req.body.category_id == 3) {
    return ProductDetail.create(req.body).then(function(prod) {
      if(prod) {
        if(req.body.i_data.length != 0) {
          var iObj, iRes, sObj, sRes, oObj, oRes;
          for(var i=0; i<req.body.i_data.length; i++) {
            iObj = req.body.i_data[i];
            iObj['product_detail_id'] = prod._id;
            iRes = ProductInputDcData.create(iObj);
          }
          for(var i=0; i<req.body.o_data.length; i++) {
            oObj = req.body.o_data[i];
            oObj['product_detail_id'] = prod._id;
            oRes = ProductOutputAcData.create(oObj);
          }
          for(var i=0; i<req.body.features.length; i++) {
            sObj = req.body.features[i];
            sObj['product_detail_id'] = prod._id;
            sRes = ProductSplFeature.create(sObj);
          }
  
          if(iRes && sRes && oRes) {
            var base64String = brochure.base64;
            var filepath = './assets/brochure/'+prod._id+brochure.filename;
            var path = './client/assets/brochure/'+prod._id+brochure.filename;
            base64.decode(base64String, path, function(err, output) {
              ProductDetail.update({brochure: filepath}, {where: {_id: prod._id}}).then(function() {
                return res.status(200).json({message: "Product sucessfully added"})
              })
              .catch(handleError(res));
            });
          }
        }
      }
    })
    .catch(handleError(res));
  }

  if(req.body.category_id == 4) {
    return ProductDetail.create(req.body).then(function(prod) {
      if(prod) {
        if(req.body.k_data.length != 0) {
          var kObj, kRes, sObj, sRes;
          for(var i=0; i<req.body.k_data.length; i++) {
            kObj = req.body.k_data[i];
            kObj['product_detail_id'] = prod._id;
            kRes = ProductKitsData.create(kObj);
          }
          for(var i=0; i<req.body.features.length; i++) {
            sObj = req.body.features[i];
            sObj['product_detail_id'] = prod._id;
            sRes = ProductSplFeature.create(sObj);
          }
  
          if(kRes && sRes) {
            var base64String = brochure.base64;
            var filepath = './assets/brochure/'+prod._id+brochure.filename;
            var path = './client/assets/brochure/'+prod._id+brochure.filename;
            base64.decode(base64String, path, function(err, output) {
              ProductDetail.update({brochure: filepath}, {where: {_id: prod._id}}).then(function() {
                return res.status(200).json({message: "Product sucessfully added"})
              })
              .catch(handleError(res));
            });
          }
        }
      }
    })
    .catch(handleError(res));
  }

}

export function getproductdetails(req, res) {
  var category_id = req.body.cid;
  var product_detail_id = req.body.pid;

  if(category_id == 2) {
    return ProductElectricalData.findAll({where: {product_detail_id: product_detail_id}}).then(function(elist) {
      return ProductMechanicalData.findOne({where: {product_detail_id: product_detail_id}}).then(function(mlist) {
        return ProductSplFeature.findAll({where: {product_detail_id: product_detail_id}}).then(function(flist) {
          return res.status(200).json({elist: elist, mlist: mlist, flist: flist});
        })
        .catch(handleError(res));
      })
      .catch(handleError(res));
    })
    .catch(handleError(res));
  }

  if(category_id == 3) {
    return ProductInputDcData.findAll({where: {product_detail_id: product_detail_id}}).then(function(ilist) {
      return ProductOutputAcData.findAll({where: {product_detail_id: product_detail_id}}).then(function(olist) {
        return ProductSplFeature.findAll({where: {product_detail_id: product_detail_id}}).then(function(flist) {
          return res.status(200).json({ilist: ilist, olist: olist, flist: flist});
        })
        .catch(handleError(res));
      })
      .catch(handleError(res));
    })
    .catch(handleError(res));
  }

  if(category_id == 4) {
    return ProductKitsData.findAll({where: {product_detail_id: product_detail_id}}).then(function(klist) {
      return ProductSplFeature.findAll({where: {product_detail_id: product_detail_id}}).then(function(flist) {
        return res.status(200).json({klist: klist, flist: flist});
      })
      .catch(handleError(res));
    })
    .catch(handleError(res));
  }
}

// Upserts the given ProductDetail in the DB at the specified ID
export function upsert(req, res) {
  var brochure = req.body.brochurefiles;
  var prod = req.body;

  if(brochure == undefined) {
    return ProductDetail.update(req.body, {
      where: {
        _id: req.body._id
      }
    })
      .then(function() {
        return res.status(200).json({message: 'Successfully Updated'})
      })
      .catch(handleError(res));
  } else {
    var fPath = 'client/';
    fPath = fPath + req.body.brochure;
    fs.unlinkSync(fPath);
    var base64String = brochure.base64;
    var filepath = './assets/brochure/'+prod._id+brochure.filename;
    var path = './client/assets/brochure/'+prod._id+brochure.filename;
    base64.decode(base64String, path, function(err, output) {
      prod.brochure = filepath;
      ProductDetail.update(prod, {where: {_id: prod._id}}).then(function() {
        return res.status(200).json({message: "Product sucessfully Updated"})
      })
      .catch(handleError(res));
    });
  }
}

// Updates an existing ProductDetail in the DB
export function patch(req, res) {
  if(req.body._id) {
    Reflect.deleteProperty(req.body, '_id');
  }
  return ProductDetail.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a ProductDetail from the DB
export function destroy(req, res) {
  return ProductDetail.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
