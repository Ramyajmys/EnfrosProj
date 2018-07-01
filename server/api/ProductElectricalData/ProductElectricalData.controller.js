/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/ProductElectricalDatas              ->  index
 * POST    /api/ProductElectricalDatas              ->  create
 * GET     /api/ProductElectricalDatas/:id          ->  show
 * PUT     /api/ProductElectricalDatas/:id          ->  upsert
 * PATCH   /api/ProductElectricalDatas/:id          ->  patch
 * DELETE  /api/ProductElectricalDatas/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import {ProductElectricalData} from '../../sqldb';

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

// Gets a list of ProductElectricalDatas
export function index(req, res) {
  return ProductElectricalData.findAll()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single ProductElectricalData from the DB
export function show(req, res) {
  return ProductElectricalData.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new ProductElectricalData in the DB
export function create(req, res) {
  return ProductElectricalData.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Upserts the given ProductElectricalData in the DB at the specified ID
export function upsert(req, res) {
  if(req.body._id) {
    Reflect.deleteProperty(req.body, '_id');
  }

  return ProductElectricalData.upsert(req.body, {
    where: {
      _id: req.params.id
    }
  })
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing ProductElectricalData in the DB
export function patch(req, res) {
  if(req.body._id) {
    Reflect.deleteProperty(req.body, '_id');
  }
  return ProductElectricalData.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a ProductElectricalData from the DB
export function destroy(req, res) {
  return ProductElectricalData.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
