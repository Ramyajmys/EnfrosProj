/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/orderDetails              ->  index
 * POST    /api/orderDetails              ->  create
 * GET     /api/orderDetails/:id          ->  show
 * PUT     /api/orderDetails/:id          ->  upsert
 * PATCH   /api/orderDetails/:id          ->  patch
 * DELETE  /api/orderDetails/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import {OrderDetail} from '../../sqldb';
import config from '../../config/environment';
var nodemailer = require('nodemailer');

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

// Gets a list of OrderDetails
export function index(req, res) {
  return OrderDetail.findAll()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

export function getdetails(req, res) {
  return OrderDetail.findAll({where: {order_id: req.body.id}})
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single OrderDetail from the DB
export function show(req, res) {
  return OrderDetail.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new OrderDetail in the DB
export function create(req, res) {
  return OrderDetail.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Upserts the given OrderDetail in the DB at the specified ID
export function upsert(req, res) {
  if(req.body._id) {
    Reflect.deleteProperty(req.body, '_id');
  }

  return OrderDetail.upsert(req.body, {
    where: {
      _id: req.params.id
    }
  })
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing OrderDetail in the DB
export function patch(req, res) {
  if(req.body._id) {
    Reflect.deleteProperty(req.body, '_id');
  }
  return OrderDetail.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a OrderDetail from the DB
export function destroy(req, res) {
  return OrderDetail.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}


export function sendEmail(req, res) {

  var email = req.body.email;
  var name = req.body.name;
  var textmsg = req.body.text;

  var transporter = nodemailer.createTransport({
    service: config.service,
    host: config.mailHost,
    port: config.mailPort,
    secureConnection: config.secureConnection,
    auth: {
      user: config.email,
      pass: config.password
    }
  });
  
  var mailOptions = {
    from: config.mailSenderId,
    to: email, 
    subject: 'Welcome, '+ name + '!', 
    text: name + ',\n\nThanks for joining our community. If you have any questions, please don\'t hesitate to send them our way. Feel free to reply to this email directly.\n\nSincerely,\nThe Management',
    html: '<head><meta charset="ISO-8859-1"><title>Invitation URL</title>' +
    '</head><body><p style="padding:0"></p> ' +
    '<p id="demo"style="float:right"></p>' +
    '<script>var d = new Date(); var n = d.toDateString(); document.getElementById("demo").innerHTML = n;</script>' +
    '<table style="background: #F5F6F7; width: 100%;">\
      <tbody>\
        <tr>\
          <td>\
              <table style="width: 700px; margin: auto; margin-top: 50px; border-radius: 7px;">\
                <tbody>\
                  <tr>\
                    <td style="border-top-left-radius: 6px; border-top-right-radius: 6px; background: #263238;\
                            background-size: 300px; background-position: 100%; background-repeat: no-repeat;\
                            line-height: 55px; padding-top: 40px; text-align: center; color: #ffffff;\
                            display: block; margin: 0 auto; clear: both">\
                            <h2 style="font-family: Helvetica neue, Helvetica, Arial, Lucida Grande sans-serif;\
                                  margin-bottom: 15px; color: #47505e; margin: 0px 0 10px; line-height: 1.2;\
                                  font-weight: 200; line-height: 45px; margin-bottom: 30px;\
                                  font-size: 25px; line-height: 40px; margin-bottom: 10px; font-weight: 400;\
                                  color: #ffffff; padding-left: 40px; padding-right: 40px; padding-top: 40px;\
                                  padding-top: 0px; color: #009688">Enfros Solution</h2>\
                            <h1 style="font-family: Helvetica neue, Helvetica, Arial, Lucida Grande sans-serif;\
                                      margin-bottom: 15px; color: #47505e; margin: 0px 0 10px; line-height: 1.2;\
                                      font-weight: 200; line-height: 45px; font-weight: bold; margin-bottom: 30px;\
                                      font-size: 28px; line-height: 40px; margin-bottom: 10px; font-weight: 400;\
                                      color: #ffffff; padding-left: 40px; padding-right: 40px; padding-top: 40px;\
                                      padding-bottom: 40px; padding-top: 0px;">Welcome, '+ name + '</h1>\</td></tr>\
                  <tr><td style="background: #fff; border-top-left-radius: 6px; border-top-right-radius: 6px;\
                      padding-bottom: 40px; margin: 0 aut0; clear: both;">\
                      <p style="font-family: Helvetica neue, Helvetica, Arial, Lucida Grande sans-serif;\
                              font-weight: normal; padding: 0; line-height: 1.7; margin-bottom: 1.3em;\
                              font-size: 15px; color: #47505e; padding-left: 40px; padding-right: 40px;">\
                              ' + textmsg + '</p>\
                      <p style="font-family: Helvetica neue, Helvetica, Arial, Lucida Grande sans-serif;\
                              font-weight: normal; padding: 0; line-height: 1.7; margin-bottom: 1.3em;\
                              font-size: 15px; color: #47505e; padding-left: 40px; padding-right: 40px;"> \
                              Please contact us if you have any \
                              questions regarding your order.<br><br></p>\
                      <p style="font-family: Helvetica neue, Helvetica, Arial, Lucida Grande sans-serif;\
                              font-weight: normal; padding: 0; line-height: 1.7; margin-bottom: 1.3em;\
                              font-size: 15px; color: #47505e; padding-left: 40px; padding-right: 40px;\
                              margin-bottom: 0; padding-bottom: 0;">\
                              Regards,\
                              <br>\
                              Enfros team</p>\
                      </td>\
                  </tr>\
              </tbody>\
          </table>\
          <div style="padding-top: 20px; padding-bottom: 30px; width: 100%; text-align: center; clear: both;">\
              <p style="font-family: Helvetica neue, Helvetica, Arial, Lucida Grande sans-serif;\
                      font-weight: normal; padding: 0; line-height: 1.7; margin-bottom: 1.3em;\
                      font-size: 12px; color: #47505e; color: #666; margin-top: 0px;">\
                      Copyright © Enfros Solution. All right reserved.</p>\
          </div>\
          <br>\
        </td>\
      </tr>\
    </tbody>\
  </table>'
  };
    
  transporter.sendMail(mailOptions, (error, success) => {
    if (error) {
      return res.status(400).json({message: 'Email Error'})
    } else {
      return res.status(200).json({message: 'Email Sent'})
    }
  });
}

export function sendSMS(req, res) {
  
}


