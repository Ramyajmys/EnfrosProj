/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/billingProducts              ->  index
 * POST    /api/billingProducts              ->  create
 * GET     /api/billingProducts/:id          ->  show
 * PUT     /api/billingProducts/:id          ->  upsert
 * PATCH   /api/billingProducts/:id          ->  patch
 * DELETE  /api/billingProducts/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import { BillingProduct } from '../../sqldb';
import { PurchaseEntries } from '../../sqldb';

var base64 = require('file-base64');
var fs = require('fs');

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

// Gets a list of BillingProducts
export function index(req, res) {
  return BillingProduct.findAll()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single BillingProduct from the DB
export function show(req, res) {
  return BillingProduct.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new BillingProduct in the DB
export function create(req, res) {
  BillingProduct.create(req.body).then(function (prod) {
    if(prod) {
    var dObj = {
      supplier_name: req.body.supplier_name,
      quantity: req.body.quantity,
      purchase_price: req.body.purchase_price,
      payment_status: req.body.payment,
      fcopy: req.body.brochurefiles,
      prod_id: prod._id
    };
    var brochure = req.body.brochurefiles;
    var base64String = brochure.base64;
    var mode = process.env.NODE_ENV;
    var filepath, path;
    if (mode == 'development') {
      filepath = './assets/attachment/' + prod._id + brochure.filename;
      path = './client/assets/attachment/' + prod._id + brochure.filename;
      dObj['attachment'] = filepath;
    } else if (mode == 'production') {
      filepath = './assets/attachment/' + prod._id + brochure.filename;
      path = './dist/client/assets/attachment/' + prod._id + brochure.filename;
      dObj['attachment'] = filepath;
    }
    // console.log(dObj)
    base64.decode(base64String, path, function (err, output) {
      if (!err) {
        PurchaseEntries.create(dObj).then(function () {
          return res.status(200).json({ message: "sucessfully Created" })
        })
          .catch(handleError(res));
      }
    });
    }
  })
    .catch(handleError(res));
  // return BillingProduct.create(req.body)
  //   .then(respondWithResult(res, 201))
  //   .catch(handleError(res));
}

// Upserts the given BillingProduct in the DB at the specified ID
export function upsert(req, res) {
  if (req.body._id) {
    Reflect.deleteProperty(req.body, '_id');
  }

  return BillingProduct.upsert(req.body, {
    where: {
      _id: req.params.id
    }
  })
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing BillingProduct in the DB
export function patch(req, res) {
  if (req.body._id) {
    Reflect.deleteProperty(req.body, '_id');
  }
  return BillingProduct.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a BillingProduct from the DB
export function destroy(req, res) {
  return BillingProduct.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}

export function getAllBill(req, res) {
  var limit = 10;
  var offset = (req.body.offset - 1) * limit;

  return BillingProduct.findAll({offset: offset, limit: limit, order: [['_id', 'DESC']], include: [{model: PurchaseEntries, attributes: ['_id', 'supplier_name', 'quantity', 'purchase_price', 'payment_status', 'attachment', 'prod_id']}]})
  .then(respondWithResult(res))
  .catch(handleError(res));
}

export function getAllCount(req, res) {
  return BillingProduct.count()
  .then(respondWithResult(res))
  .catch(handleError(res));
}