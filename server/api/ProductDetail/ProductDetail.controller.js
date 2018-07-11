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
import {HSN} from '../../sqldb';

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
  return ProductDetail.findAll({include: [{model: HSN}]})
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

// Creates a new ProductDetail in the DB
export function create(req, res) {
  // return ProductDetail.create(req.body)
  //   .then(respondWithResult(res, 201))
  //   .catch(handleError(res));
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
          return res.status(200).json({message: "product added"})
        }
      }
    }
  })
}

// Upserts the given ProductDetail in the DB at the specified ID
export function upsert(req, res) {
  if(req.body._id) {
    Reflect.deleteProperty(req.body, '_id');
  }

  return ProductDetail.upsert(req.body, {
    where: {
      _id: req.params.id
    }
  })
    .then(respondWithResult(res))
    .catch(handleError(res));
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
