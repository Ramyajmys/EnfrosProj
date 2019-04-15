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
import { PurchaseEntries } from '../../sqldb';
import { BillingProduct } from '../../sqldb';

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function (entity) {
    if (entity) {
      return res.status(statusCode).json(entity);
    }
    return null;
  };
}

function patchUpdates(patches) {
  return function (entity) {
    try {
      // eslint-disable-next-line prefer-reflect
      jsonpatch.apply(entity, patches, /*validate*/ true);
    } catch (err) {
      return Promise.reject(err);
    }

    return entity.save();
  };
}

function removeEntity(res) {
  return function (entity) {
    if (entity) {
      return entity.destroy()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function (entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function (err) {
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
  var obj = {
    supplier_name: req.body.supplier_name,
    quantity: req.body.quantity,
    purchase_price: req.body.purchase_price,
    payment_status: req.body.payment_status,
    file: Buffer.from(req.body.brochure.base64, 'base64'),
    filetype: req.body.brochure.filetype,
    filename: req.body.brochure.filename,
    prod_id: req.body.prod_id
  };

  PurchaseEntries.create(obj).then(function(entry) {
    // console.log(entry)
    BillingProduct.find({where: {_id: req.body.prod_id}}).then(function(prod) {
      // console.log(prod)
      if(prod) {
        // console.log(prod)
        var total = parseInt(prod.total_quantity) + req.body.quantity;
        BillingProduct.update({total_quantity: total},{where: {_id: req.body.prod_id}}).then(function() {
          return res.status(200).json({entry: entry});
        })
        .catch(handleError(res));
      }
    })
    .catch(handleError(res));
  })
  .catch(handleError(res));
}

// Upserts the given PurchaseEntries in the DB at the specified ID
export function upsert(req, res) {
  if (req.body._id) {
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
  if (req.body._id) {
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

export function update(req, res) {

  return PurchaseEntries.update(req.body, {
    where: {
      _id: req.body._id
    }
  })
    .then(respondWithResult(res))
    .catch(handleError(res));
}