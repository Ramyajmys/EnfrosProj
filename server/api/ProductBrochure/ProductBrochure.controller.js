/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/ProductBrochures              ->  index
 * POST    /api/ProductBrochures              ->  create
 * GET     /api/ProductBrochures/:id          ->  show
 * PUT     /api/ProductBrochures/:id          ->  upsert
 * PATCH   /api/ProductBrochures/:id          ->  patch
 * DELETE  /api/ProductBrochures/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import {ProductBrochure} from '../../sqldb';

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

// Gets a list of ProductBrochures
export function index(req, res) {
  return ProductBrochure.findAll()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single ProductBrochure from the DB
export function show(req, res) {
  return ProductBrochure.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new ProductBrochure in the DB
export function create(req, res) {
  return ProductBrochure.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Upserts the given ProductBrochure in the DB at the specified ID
export function upsert(req, res) {
  if(req.body._id) {
    Reflect.deleteProperty(req.body, '_id');
  }

  return ProductBrochure.upsert(req.body, {
    where: {
      _id: req.params.id
    }
  })
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing ProductBrochure in the DB
export function patch(req, res) {
  if(req.body._id) {
    Reflect.deleteProperty(req.body, '_id');
  }
  return ProductBrochure.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a ProductBrochure from the DB
export function destroy(req, res) {
  return ProductBrochure.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
