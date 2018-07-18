/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/ProductCategorys              ->  index
 * POST    /api/ProductCategorys              ->  create
 * GET     /api/ProductCategorys/:id          ->  show
 * PUT     /api/ProductCategorys/:id          ->  upsert
 * PATCH   /api/ProductCategorys/:id          ->  patch
 * DELETE  /api/ProductCategorys/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import {ProductCategory} from '../../sqldb';
import {ProductSubCategory} from '../../sqldb';

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

// Gets a list of ProductCategorys
export function index(req, res) {
  return ProductCategory.findAll({include: [{model: ProductSubCategory}]})
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single ProductCategory from the DB
export function show(req, res) {
  return ProductCategory.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new ProductCategory in the DB
export function create(req, res) {
  return ProductCategory.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Upserts the given ProductCategory in the DB at the specified ID
export function upsert(req, res) {
  
  return ProductCategory.update(req.body, {
    where: {
      _id: req.body._id
    }
  })
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing ProductCategory in the DB
export function patch(req, res) {
  if(req.body._id) {
    Reflect.deleteProperty(req.body, '_id');
  }
  return ProductCategory.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a ProductCategory from the DB
export function destroy(req, res) {
  return ProductCategory.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
