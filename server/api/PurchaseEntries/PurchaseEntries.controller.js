/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/PurchaseEntriess              ->  index
 * POST    /api/PurchaseEntriess              ->  create
 * GET     /api/PurchaseEntriess/:id          ->  show
 * PUT     /api/PurchaseEntriess/:id          ->  upsert
 * PATCH   /api/PurchaseEntriess/:id          ->  patch
 * DELETE  /api/PurchaseEntriess/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import {PurchaseEntries} from '../../sqldb';

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

// Gets a list of PurchaseEntriess
export function index(req, res) {
  return PurchaseEntries.findAll()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single PurchaseEntries from the DB
export function show(req, res) {
  return PurchaseEntries.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new PurchaseEntries in the DB
export function create(req, res) {
  return PurchaseEntries.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Upserts the given PurchaseEntries in the DB at the specified ID
export function upsert(req, res) {
  if(req.body._id) {
    Reflect.deleteProperty(req.body, '_id');
  }

  return PurchaseEntries.upsert(req.body, {
    where: {
      _id: req.params.id
    }
  })
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing PurchaseEntries in the DB
export function patch(req, res) {
  if(req.body._id) {
    Reflect.deleteProperty(req.body, '_id');
  }
  return PurchaseEntries.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a PurchaseEntries from the DB
export function destroy(req, res) {
  return PurchaseEntries.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
