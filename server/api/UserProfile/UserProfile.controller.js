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

export function savefile(req, res) {
  var base64 = require('file-base64');
  var base64String = req.body.buffer;
  base64.decode(base64String, './assets/text.pdf', function(err, output) {
    console.log('--------------------------success');
  });
  // const base64 = require('base64topdf');
  // let decodedBase64 = base64.base64Decode('base64Str', 'PdfFileNameToWrite');

  // fs.writeFileSync('./assets/foo.pdf', base64.base64Decode('base64Str', 'PdfFileNameToWrite'));
  // var name = 'mohana'
  // var html = '<div style="width: 100%;">\
  //               <div style="text-align: center;">\
  //                   <h1>XXX XXXXXXX</h1>\
  //                   <h4>ADDRESS</h4>\
  //                   <h4>Bangalore</h4>\
  //                   <h3>GSTIN: {{printinvoiceCtrl.admin.gst_number}}</h3>\
  //               </div><hr>\
  //               <div style="width: 100%; font-size: 17px;">\
  //                 <div style="width: 50%; float: left">\
  //                     <p>Reverse Charges:</p>\
  //                     <p>Invoice No:</p>\
  //                     <p>Invoice Date:</p>\
  //                     <p>State: Karnataka</p>\
  //                 </div>\
  //                 <div style="width: 50%; float: right" >\
  //                     <p>Transportation Mode:</p>\
  //                     <p>Vehicle Number:</p>\
  //                     <p>Date of Supply:</p>\
  //                     <p>Place of Supply:</p>\
  //                 </div>\
  //               </div><hr>\
  //               <div style="font-size: 17px; width: 100%; padding: 5px">\
  //               <div style="float: left; width: 50%; ">\
  //                   <p style="font-weight: bold; text-align: center;">Details of Receiver / Billed to</p>\
  //                   <p>Name: {{printinvoiceCtrl.custInfo.User.name}}</p>\
  //                   <p>Address: {{printinvoiceCtrl.custInfo.address}}, {{printinvoiceCtrl.custInfo.City.cityName}}, \
  //                       {{printinvoiceCtrl.custInfo.State.stateName}}, {{printinvoiceCtrl.custInfo.Country.countryName}}</p>\
  //                   <p>GSTIN: {{printinvoiceCtrl.custInfo.gst_number}}</p>\
  //                   <p>State: {{printinvoiceCtrl.custInfo.State.stateName}}</p>\
  //               </div>\
  //               <div style="float: right; width: 50%; ">\
  //                   <p style="font-weight: bold; text-align: center;">Details of Consignee / Shipped to</p>\
  //                   <p>Name: {{printinvoiceCtrl.custInfo.User.name}}</p>\
  //                   <p>Address: {{printinvoiceCtrl.custInfo.address}}, {{printinvoiceCtrl.custInfo.City.cityName}}, \
  //                       {{printinvoiceCtrl.custInfo.State.stateName}}, {{printinvoiceCtrl.custInfo.Country.countryName}}</p>\
  //                   <p>GSTIN: {{printinvoiceCtrl.custInfo.gst_number}}</p>\
  //                   <p>State: {{printinvoiceCtrl.custInfo.State.stateName}}</p>\
  //               </div>\
  //               </div><hr>\
  //               <table class="table table-bordered">\
  //                 <thead>\
  //                     <tr>\
  //                         <th>Product</th>\
  //                         <th>Price</th>\
  //                         <th>Discount</th>\
  //                         <th>CGST</th>\
  //                         <th>SGST</th>\
  //                         <th>IGST</th>\
  //                         <th>Quantity</th>\
  //                         <th>Total</th>\
  //                     </tr>\
  //                 </thead>\
  //                 <tbody>\
  //                 <tr ng-repeat="cart in printinvoiceCtrl.cInfo">\
  //                     <td>\
  //                         <div layout="row">\
  //                             <div><img src="{{cart.product_photo}}" alt="Product" style="width: 100px; height: 100px;"/></div> \
  //                             <div style="padding-left: 10px;">\
  //                                 <p>{{cart.product_name}}</p>\
  //                             </div> \
  //                         </div>\
  //                     </td>\
  //                     <td><div layout="row"><i class="fa fa-inr" aria-hidden="true" style="padding-top: 5px; font-size: 12px;"></i><p>{{cart.unitprice}}</p></div></td>\
  //                     <td><div layout="row"><i class="fa fa-inr" aria-hidden="true" style="padding-top: 5px; font-size: 12px;"></i><p>{{cart.discountprice}}</p></div></td>\
  //                     <td><div layout="row"><i class="fa fa-inr" aria-hidden="true" style="padding-top: 5px; font-size: 12px;"></i><p>{{cart.tax / 2}}</p></div></td>\
  //                     <td><div layout="row"><i class="fa fa-inr" aria-hidden="true" style="padding-top: 5px; font-size: 12px;"></i><p>{{printinvoiceCtrl.gStatus == true ? cart.tax/2 : 0}}</p></div></td>\
  //                     <td><div layout="row"><i class="fa fa-inr" aria-hidden="true" style="padding-top: 5px; font-size: 12px;"></i><p>{{printinvoiceCtrl.gStatus == true ? 0 : cart.tax/2}}</p></div></td>\
  //                     <td>\
  //                         <input type="number" class="form-control" min="1" ng-model="printinvoiceCtrl.quantityNum" disabled />\
  //                     </td>\
  //                     <td><div layout="row"><i class="fa fa-inr" aria-hidden="true" style="padding-top: 5px; font-size: 12px;"></i><p>{{cart.totalprice}}</p></div></td>\
  //                 </tr>\
  //                 <tr>\
  //                     <td colspan="8" style="text-align: right; font-weight: bold;">Subtotal:  <i class="fa fa-inr" aria-hidden="true" style="padding-top: 5px; font-size: 12px;"></i>{{printinvoiceCtrl.finaltotal}}</td>\
  //                 </tr>\
  //               </tbody>\
  //             </table>\
  //             </div>'


  // var options = { format: 'A4'};
  
  // pdf.create(html, options).toFile('./assets/printinvoice.pdf', function(err, res) {
  //   if (err) return console.log(err);
  //   console.log("--------------------------------------------")
  //   console.log(res); // { filename: '/app/businesscard.pdf' }
  // });

}