/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/ProductSplFeatures              ->  index
 * POST    /api/ProductSplFeatures              ->  create
 * GET     /api/ProductSplFeatures/:id          ->  show
 * PUT     /api/ProductSplFeatures/:id          ->  upsert
 * PATCH   /api/ProductSplFeatures/:id          ->  patch
 * DELETE  /api/ProductSplFeatures/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import {ProductSplFeature} from '../../sqldb';

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

// Gets a list of ProductSplFeatures
export function index(req, res) {
  return ProductSplFeature.findAll()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single ProductSplFeature from the DB
export function show(req, res) {
  return ProductSplFeature.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new ProductSplFeature in the DB
export function create(req, res) {
  return ProductSplFeature.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Upserts the given ProductSplFeature in the DB at the specified ID
export function upsert(req, res) {
  if(req.body._id) {
    Reflect.deleteProperty(req.body, '_id');
  }

  return ProductSplFeature.upsert(req.body, {
    where: {
      _id: req.params.id
    }
  })
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing ProductSplFeature in the DB
export function patch(req, res) {
  if(req.body._id) {
    Reflect.deleteProperty(req.body, '_id');
  }
  return ProductSplFeature.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a ProductSplFeature from the DB
export function destroy(req, res) {
  return ProductSplFeature.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
