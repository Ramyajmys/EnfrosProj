/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/ProductInputDcDatas              ->  index
 * POST    /api/ProductInputDcDatas              ->  create
 * GET     /api/ProductInputDcDatas/:id          ->  show
 * PUT     /api/ProductInputDcDatas/:id          ->  upsert
 * PATCH   /api/ProductInputDcDatas/:id          ->  patch
 * DELETE  /api/ProductInputDcDatas/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import {ProductInputDcData} from '../../sqldb';

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

// Gets a list of ProductInputDcDatas
export function index(req, res) {
  return ProductInputDcData.findAll()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single ProductInputDcData from the DB
export function show(req, res) {
  return ProductInputDcData.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new ProductInputDcData in the DB
export function create(req, res) {
  return ProductInputDcData.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Upserts the given ProductInputDcData in the DB at the specified ID
export function upsert(req, res) {
  if(req.body._id) {
    Reflect.deleteProperty(req.body, '_id');
  }

  return ProductInputDcData.upsert(req.body, {
    where: {
      _id: req.params.id
    }
  })
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing ProductInputDcData in the DB
export function patch(req, res) {
  if(req.body._id) {
    Reflect.deleteProperty(req.body, '_id');
  }
  return ProductInputDcData.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a ProductInputDcData from the DB
export function destroy(req, res) {
  return ProductInputDcData.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
