/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/UserProfiles              ->  index
 * POST    /api/UserProfiles              ->  create
 * GET     /api/UserProfiles/:id          ->  show
 * PUT     /api/UserProfiles/:id          ->  upsert
 * PATCH   /api/UserProfiles/:id          ->  patch
 * DELETE  /api/UserProfiles/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import {UserProfile} from '../../sqldb';
import {User} from '../../sqldb';
import {Country} from '../../sqldb';
import {State} from '../../sqldb';
import {City} from '../../sqldb';
var fs = require('fs');
var pdf = require('html-pdf');

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

// Gets a list of UserProfiles
export function index(req, res) {
  return UserProfile.findAll()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single UserProfile from the DB
export function show(req, res) {
  return UserProfile.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new UserProfile in the DB
export function create(req, res) {
  return UserProfile.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Upserts the given UserProfile in the DB at the specified ID
export function upsert(req, res) {
  if(req.body._id) {
    Reflect.deleteProperty(req.body, '_id');
  }

  return UserProfile.upsert(req.body, {
    where: {
      _id: req.params.id
    }
  })
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing UserProfile in the DB
export function patch(req, res) {
  if(req.body._id) {
    Reflect.deleteProperty(req.body, '_id');
  }
  return UserProfile.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a UserProfile from the DB
export function destroy(req, res) {
  return UserProfile.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}

// Get User Gst
export function getUserInfo(req, res) {
    return UserProfile.find({ where: {user_id: req.body.id }, include: [{model: User}, {model: Country}, {model: State}, {model: City}]})
      .then(handleEntityNotFound(res))
      .then(respondWithResult(res))
      .catch(handleError(res));
}

export function getusers(req, res) {
  var cid = req.body.cid;
  var did = req.body.did;

  return User.find({where: {_id: cid}, include: [
    {model: UserProfile, include: [{model: City}, {model: State}, {model: Country}]}]}).then(function(customer) {
      return User.find({where: {_id: did}, include: [
        {model: UserProfile, include: [{model: City}, {model: State}, {model: Country}]}]}).then(function(distributor) {
          return res.status(200).json({customer: customer, distributor: distributor})
        })
        .catch(handleError(res));
    })
    .catch(handleError(res));
}

export function checkGst(req, res) {
  var customer = req.body.gst.substring(0, 2);
  return UserProfile.find({ where: {user_id: 1 }}).then(function(user) {
    if(customer == user.gst_number.substring(0, 2)) {
      return res.status(200).json({gstatus: true});
    } else {
      return res.status(200).json({gstatus: false});
    }
  })
    .catch(handleError(res));
}
