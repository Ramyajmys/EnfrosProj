/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/quotations              ->  index
 * POST    /api/quotations              ->  create
 * GET     /api/quotations/:id          ->  show
 * PUT     /api/quotations/:id          ->  upsert
 * PATCH   /api/quotations/:id          ->  patch
 * DELETE  /api/quotations/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import { Quotation } from '../../sqldb';
import { User } from '../../sqldb';

import config from '../../config/environment';
var fs = require('fs');
var pdf = require('html-pdf');
var nodemailer = require('nodemailer');
var Blob = require('blob');

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

// Gets a list of Quotations
export function index(req, res) {
  return Quotation.findAll()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Quotation from the DB
export function show(req, res) {
  return Quotation.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Quotation in the DB
export function create(req, res) {
  var temp = req.body.template;
  var customer = JSON.parse(req.body.customer);
  var distributor = JSON.parse(req.body.distributor);
  var dObj = {
    date: req.body.date,
    time: req.body.time,
    customer_id: customer._id,
    distributor_id: distributor._id
  };

  var img = config.domain + 'assets/logo/logo.png';

  var html = '<div style="width: 95%;padding: 10px; margin:auto; text-align: center; letter-spacing:1px; font-size: 20px;">\
  <div style="width: 95%; text-align: right; ">\
      <img src='+ img + ' style="width:190px; height:80px"/><br>\
  </div>'+ temp + '</div>';

  var etemp = emailTemp(customer.name);

  Quotation.create(dObj).then(function (quot) {
    if (quot) {
      // console.log(quot)
      pdf.create(html).toBuffer(function (err, buffer) {
        if (!err) {
          var bas = buffer.toString('base64')
          Quotation.update({ file: buffer }, { where: { _id: quot._id } }).then(function (yes) {
            // console.log(yes)
            // sendEmailNotification1(customer.email, customer.name, bas);
            // return res.status(200).json({ msg: 'Succcessfully Created' });


            var transporter = nodemailer.createTransport({
              service: config.service,
              host: config.mailHost,
              port: config.mailPort,
              secureConnection: config.secureConnection,
              auth: {
                user: config.email,
                pass: config.password
              }
              // service: 'gmail',
              // auth: {
              //   user: 'enfros.erp@gmail.com',
              //   pass: 'enfros@123'
              // }
              // service: 'Godaddy',
              // host: 'smtpout.secureserver.net',
              // port: 465,
              // secureConnection: true,
              // auth: {
              //   user: 'info@enfros.co.in',
              //   pass: 'abcd12345'
              // }
            });
            // console.log(transporter);
            var mailOptions = {
              from: config.mailSenderId,
              to: customer.email,
              attachments: [{
                filename: new Date().getTime().toString() + '.pdf',
                content: bas,
                encoding: 'base64'
              }],
              subject: 'Welcome, ' + customer.name + '!',
              text: customer.name + ',\n\nThanks for joining our community. If you have any questions, please don\'t hesitate to send them our way. Feel free to reply to this email directly.\n\nSincerely,\nThe Management',
              html: etemp
            };
            // console.log("yes")
            transporter.sendMail(mailOptions, (error, success) => {
              // console.log("yes")
              if (error) {
                console.log(error)
                return res.status(200).json({ msg: 'Succcessfully Created, but Email not sent. Error - ' + error });
              } else {
                return res.status(200).json({ msg: 'Succcessfully Created' });
              }
            });

          })
            .catch(handleError(res));
        }
      });
    }
  })
    .catch(handleError(res));
}

// function createQ(quot, filename, customer) {
//   var temp = quot;
//   var img = config.domain + 'assets/images/logo.png';

//   var html = '<div style="width: 95%;padding: 10px; margin:auto; text-align: center; letter-spacing:1px; font-size: 20px;">\
//   <div style="width: 95%; text-align: right; ">\
//       <img src='+ img + ' style="width:190px; height:80px"/><br>\
//   </div>'+ temp + '</div>';

//   var options = {
//     format: "A4", orientation: "potrait", border: {
//       right: "10px",
//       bottom: "20px"
//     }
//   };

//   var mode = process.env.NODE_ENV;
//   var path;
//   if (mode == 'development') {
//     path = './client/assets/quotation/' + filename + '.pdf';
//   } else if (mode == 'production') {
//     path = './dist/client/assets/quotation/' + filename + '.pdf';
//   }

//   pdf.create(html, options).toFile(path, function (err, res) {
//     if (err) {
//       console.log(err)
//     } else {
//       sendEmailNotification(customer.email, customer.name, filename, path);
//     }
//   });

//   // pdf.create(html).toBuffer(function(err, buffer){
//   //   // console.log('This is a buffer:', Buffer.isBuffer(buffer));
//   //   console.log('This is a buffer:', buffer);
//   // });
// }

export function getAllQuotes(req, res) {
  var limit = 10;
  var offset = (req.body.offset - 1) * limit;

  return Quotation.findAll({ offset: offset, limit: limit, order: [['_id', 'DESC']], attributes: ['_id', 'date', 'time'], include: [{ model: User, as: 'distributor' }, { model: User, as: 'customer' }] })
    .then(respondWithResult(res))
    .catch(handleError(res));
}

export function getAllQuoteCount(req, res) {
  return Quotation.count().then(function (quot) {
    res.status(200).json({ count: quot })
  })
    .catch(handleError(res));
}

// Upserts the given Quotation in the DB at the specified ID
export function upsert(req, res) {
  if (req.body._id) {
    Reflect.deleteProperty(req.body, '_id');
  }

  return Quotation.upsert(req.body, {
    where: {
      _id: req.params.id
    }
  })
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing Quotation in the DB
export function patch(req, res) {
  if (req.body._id) {
    Reflect.deleteProperty(req.body, '_id');
  }
  return Quotation.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Quotation from the DB
export function destroy(req, res) {
  return Quotation.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}

// function sendEmailNotification(email, name, file, path) {

//   var transporter = nodemailer.createTransport({
//     service: config.service,
//     host: config.mailHost,
//     port: config.mailPort,
//     secureConnection: config.secureConnection,
//     auth: {
//       user: config.email,
//       pass: config.password
//     }
//   });

//   var mailOptions = {
//     from: config.mailSenderId,
//     to: email,
//     attachments: [{ filename: file + '.pdf', path: path, contentType: 'application/pdf' }],
//     subject: 'Welcome, ' + name + '!',
//     text: name + ',\n\nThanks for joining our community. If you have any questions, please don\'t hesitate to send them our way. Feel free to reply to this email directly.\n\nSincerely,\nThe Management',
//     html: '<head><meta charset="ISO-8859-1"><title>Invitation URL</title>' +
//       '</head><body><p style="padding:0"></p> ' +
//       '<p id="demo"style="float:right"></p>' +
//       '<script>var d = new Date(); var n = d.toDateString(); document.getElementById("demo").innerHTML = n;</script>' +
//       '<table style="background: #F5F6F7; width: 100%;">\
//       <tbody>\
//         <tr>\
//           <td>\
//               <table style="width: 700px; margin: auto; margin-top: 50px; border-radius: 7px;">\
//                 <tbody>\
//                   <tr>\
//                     <td style="border-top-left-radius: 6px; border-top-right-radius: 6px; background: #263238;\
//                             background-size: 300px; background-position: 100%; background-repeat: no-repeat;\
//                             line-height: 55px; padding-top: 40px; text-align: center; color: #ffffff;\
//                             display: block; margin: 0 auto; clear: both">\
//                             <h2 style="font-family: Helvetica neue, Helvetica, Arial, Lucida Grande sans-serif;\
//                                   margin-bottom: 15px; color: #47505e; margin: 0px 0 10px; line-height: 1.2;\
//                                   font-weight: 200; line-height: 45px; margin-bottom: 30px;\
//                                   font-size: 25px; line-height: 40px; margin-bottom: 10px; font-weight: 400;\
//                                   color: #ffffff; padding-left: 40px; padding-right: 40px; padding-top: 40px;\
//                                   padding-top: 0px; color: #009688">Enfros Solution</h2>\
//                             <h1 style="font-family: Helvetica neue, Helvetica, Arial, Lucida Grande sans-serif;\
//                                       margin-bottom: 15px; color: #47505e; margin: 0px 0 10px; line-height: 1.2;\
//                                       font-weight: 200; line-height: 45px; font-weight: bold; margin-bottom: 30px;\
//                                       font-size: 28px; line-height: 40px; margin-bottom: 10px; font-weight: 400;\
//                                       color: #ffffff; padding-left: 40px; padding-right: 40px; padding-top: 40px;\
//                                       padding-bottom: 40px; padding-top: 0px;">Welcome, '+ name + '</h1>\</td></tr>\
//                   <tr><td style="background: #fff; border-top-left-radius: 6px; border-top-right-radius: 6px;\
//                       padding-bottom: 40px; margin: 0 aut0; clear: both;">\
//                       <p style="font-family: Helvetica neue, Helvetica, Arial, Lucida Grande sans-serif;\
//                               font-weight: normal; padding: 0; line-height: 1.7; margin-bottom: 1.3em;\
//                               font-size: 15px; color: #47505e; padding-left: 40px; padding-right: 40px;">\
//                               Thank you for placing your order with Enfros Solution.<br></p>\
//                       <p style="font-family: Helvetica neue, Helvetica, Arial, Lucida Grande sans-serif;\
//                               font-weight: normal; padding: 0; line-height: 1.7; margin-bottom: 1.3em;\
//                               font-size: 15px; color: #47505e; padding-left: 40px; padding-right: 40px;\
//                               margin-bottom: 0; padding-bottom: 0;">\
//                               Regards,\
//                               <br>\
//                               Enfros team</p>\
//                       </td>\
//                   </tr>\
//               </tbody>\
//           </table>\
//           <div style="padding-top: 20px; padding-bottom: 30px; width: 100%; text-align: center; clear: both;">\
//               <p style="font-family: Helvetica neue, Helvetica, Arial, Lucida Grande sans-serif;\
//                       font-weight: normal; padding: 0; line-height: 1.7; margin-bottom: 1.3em;\
//                       font-size: 12px; color: #47505e; color: #666; margin-top: 0px;">\
//                       Copyright © Enfros Solution. All right reserved.</p>\
//           </div>\
//           <br>\
//         </td>\
//       </tr>\
//     </tbody>\
//   </table>'
//   };

//   transporter.sendMail(mailOptions, (error, success) => {
//     if (error) {
//       return console.log(error);
//     }
//     console.log('Mail sent');
//   });
// }


function sendEmailNotification1(email, name, file) {

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
    attachments: [{
      filename: new Date().getTime().toString() + '.pdf',
      content: file,
      encoding: 'base64'
    }],
    subject: 'Welcome, ' + name + '!',
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
                              Thank you for placing your order with Enfros Solution.<br></p>\
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
      return console.log(error);
    }
    console.log('Mail sent');
  });
}

function emailTemp(name) {

  var html = '<head><meta charset="ISO-8859-1"><title>Invitation URL</title>' +
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
                          Thank you for placing your order with Enfros Solution.<br></p>\
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
</table>';

  return html;
}

export function sendContactInfo(req, res) {

  var cinfo = req.body;
  // console.log(cinfo.attachment.base64)
  var mailOptions = {};

  return User.find({ where: { role: 'admin' } }).then(function (auser) {
    // console.log(auser);
    var etemp = conatctemailTemp(cinfo, auser);

    if (auser) {

      var transporter = nodemailer.createTransport({
        // service: config.service,
        host: config.mailHost,
        port: config.mailPort,
        secureConnection: config.secureConnection,
        auth: {
          user: config.email,
          pass: config.password
        }
      });
      // console.log("---------------------------")
      // console.log(config.mailSenderId)
      // console.log(auser.email)
      // console.log(transporter);
      
      if(req.body.attachment) {
        mailOptions = {
          from: config.mailSenderId,
          to: auser.email,
          attachments: [{
            filename: new Date().getTime().toString() + cinfo.attachment.filename,
            content: req.body.basestring,
            encoding: 'base64'
          }],
          subject: 'Hello ' + auser.name + ', Here is the New Conatct Details!',
          text: '',
          html: etemp
        };
      } else {
        mailOptions = {
          from: config.mailSenderId,
          to: auser.email,
          subject: 'Hello ' + auser.name + ', Here is the New Conatct Details!',
          text: '',
          html: etemp
        };
      }

      // console.log(mailOptions)
      // console.log("--------yes")
      transporter.sendMail(mailOptions, (error, success) => {
        // console.log("yes------------------------------")
        if (error) {
          console.log(error)
          return res.status(200).json({ msg: 'Some problem with the server, Please try again later' + error });
        } if (success) {
          return res.status(200).json({ msg: 'Succcessfully Sent' });
        }
      });
      // async function main() {
      //   let transporter = nodemailer.createTransport({
      //     host: config.mailHost,
      //     port: 587,
      //     secure: false, // true for 465, false for other ports
      //     auth: {
      //       user: config.email,
      //       pass: config.password
      //     }
      //   });

      //   let info = await transporter.sendMail({

      //     from: '"Fred Foo 👻" <foo@example.com>',
      //     to: auser.email,
      //     subject: 'Hello ' + auser.name + ', Here is New Conatct Details!',
      //     text: "Hello world?", // plain text body
      //     attachments: [{
      //       filename: new Date().getTime().toString() + '.pdf',
      //       content: attach,
      //       encoding: 'base64'
      //     }],
      //     html: etemp
      //   });

      //   console.log("Message sent: %s", info.messageId);
      // }
      // main().catch(console.error);
    }
  })
    .catch(handleError(res));
}

function conatctemailTemp(data, admin) {

  var html = '<head><meta charset="ISO-8859-1"><title>Invitation URL</title>' +
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
                                  padding-bottom: 40px; padding-top: 0px;">Welcome, '+ admin.name + '</h1>\</td></tr>\
              <tr><td style="background: #fff; border-top-left-radius: 6px; border-top-right-radius: 6px;\
                  padding-bottom: 40px; margin: 0 aut0; clear: both;">\
                  <p style="font-family: Helvetica neue, Helvetica, Arial, Lucida Grande sans-serif;\
                          font-weight: normal; padding: 0; line-height: 1.7; margin-bottom: 1.3em;\
                          font-size: 15px; color: #47505e; padding-left: 40px; padding-right: 40px;">\
                          Here is the contact details.<br><br>Name: '+ data.firstname + ' ' + data.lastname + '<br>Email: ' + data.email + '<br>Contact Number: ' + data.contactnumber + '<br>Address: ' + data.country + '<br>Pincode: ' + data.zip + '<br>Contact preference: ' + data.preference + '<br>Contact time: ' + data.calltime + '</p>\
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
</table>';

  return html;
}