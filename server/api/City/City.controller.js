/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/Citys              ->  index
 * POST    /api/Citys              ->  create
 * GET     /api/Citys/:id          ->  show
 * PUT     /api/Citys/:id          ->  upsert
 * PATCH   /api/Citys/:id          ->  patch
 * DELETE  /api/Citys/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import {City} from '../../sqldb';
import {State} from '../../sqldb';

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

// Gets a list of Citys
export function index(req, res) {
  return City.findAll()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single City from the DB
export function show(req, res) {
  return City.findAll({
    where: {
      state_id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new City in the DB
export function create(req, res) {
  return City.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Upserts the given City in the DB at the specified ID
export function upsert(req, res) {
  if(req.body._id) {
    Reflect.deleteProperty(req.body, '_id');
  }

  return City.upsert(req.body, {
    where: {
      _id: req.params.id
    }
  })
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing City in the DB
export function patch(req, res) {
  if(req.body._id) {
    Reflect.deleteProperty(req.body, '_id');
  }
  return City.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a City from the DB
export function destroy(req, res) {
  return City.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}

export function getAllCity(req, res) {
  var limit = 10;
  var offset = (req.body.offset - 1) * limit;

  return City.findAll({offset: offset, limit: limit, order: [['_id', 'DESC']], include: [{model: State}]})
  .then(respondWithResult(res))
  .catch(handleError(res));
}

export function getAllCount(req, res) {
  return City.count()
  .then(respondWithResult(res))
  .catch(handleError(res));
}