/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/ProductKeyNotes              ->  index
 * POST    /api/ProductKeyNotes              ->  create
 * GET     /api/ProductKeyNotes/:id          ->  show
 * PUT     /api/ProductKeyNotes/:id          ->  upsert
 * PATCH   /api/ProductKeyNotes/:id          ->  patch
 * DELETE  /api/ProductKeyNotes/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import {ProductKeyNote} from '../../sqldb';

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

// Gets a list of ProductKeyNotes
export function index(req, res) {
  return ProductKeyNote.findAll()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single ProductKeyNote from the DB
export function show(req, res) {
  return ProductKeyNote.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new ProductKeyNote in the DB
export function create(req, res) {
  return ProductKeyNote.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Upserts the given ProductKeyNote in the DB at the specified ID
export function upsert(req, res) {
  if(req.body._id) {
    Reflect.deleteProperty(req.body, '_id');
  }

  return ProductKeyNote.upsert(req.body, {
    where: {
      _id: req.params.id
    }
  })
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing ProductKeyNote in the DB
export function patch(req, res) {
  if(req.body._id) {
    Reflect.deleteProperty(req.body, '_id');
  }
  return ProductKeyNote.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a ProductKeyNote from the DB
export function destroy(req, res) {
  return ProductKeyNote.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
