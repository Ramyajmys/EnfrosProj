/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/orders              ->  index
 * POST    /api/orders              ->  create
 * GET     /api/orders/:id          ->  show
 * PUT     /api/orders/:id          ->  upsert
 * PATCH   /api/orders/:id          ->  patch
 * DELETE  /api/orders/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import { Order } from '../../sqldb';
import { OrderDetail } from '../../sqldb';
import config from '../../config/environment';
import { User } from '../../sqldb';
import { UserProfile } from '../../sqldb';
import { Status } from '../../sqldb';
import { Country } from '../../sqldb';
import { State } from '../../sqldb';
import { City } from '../../sqldb';
import { PurchaseEntries } from '../../sqldb';
import { BillingProduct } from '../../sqldb';

var fs = require('fs');
var pdf = require('html-pdf');
var nodemailer = require('nodemailer');

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

// Gets a list of Orders
// export function index(req, res) {
//   return Order.findAll({include: [{model: User, as: 'distributor'}, {model: User, as: 'customer'}, {model: Status}]})
//     .then(respondWithResult(res))
//     .catch(handleError(res));
// }

// Gets a list of Orders
export function getordersbyrole(req, res) {
  if(req.body.sid != 0) {
    if (req.body.role == 'admin') {
      return Order.count({ where: { status_id: req.body.sid }, include: [{ model: User, as: 'distributor' }, { model: User, as: 'customer' }, { model: Status }] })
        .then(function (count) {
          res.status(200).json({ count: count })
        })
        .catch(handleError(res));
    }
    if (req.body.role == 'Distributor') {
      return Order.count({ where: { distributor_id: req.body.id, status_id: req.body.sid }, include: [{ model: User, as: 'distributor' }, { model: User, as: 'customer' }, { model: Status }] })
        .then(function (count) {
          res.status(200).json({ count: count })
        })
        .catch(handleError(res));
    }
    if (req.body.role == 'Customer') {
      return Order.count({ where: { customer_id: req.body.id, status_id: req.body.sid }, include: [{ model: User, as: 'distributor' }, { model: User, as: 'customer' }, { model: Status }] })
        .then(function (count) {
          res.status(200).json({ count: count })
        })
        .catch(handleError(res));
    }
  } else {
    if (req.body.role == 'admin') {
      return Order.count({ include: [{ model: User, as: 'distributor' }, { model: User, as: 'customer' }, { model: Status }] })
        .then(function (count) {
          res.status(200).json({ count: count })
        })
        .catch(handleError(res));
    }
    if (req.body.role == 'Distributor') {
      return Order.count({ where: { distributor_id: req.body.id }, include: [{ model: User, as: 'distributor' }, { model: User, as: 'customer' }, { model: Status }] })
        .then(function (count) {
          res.status(200).json({ count: count })
        })
        .catch(handleError(res));
    }
    if (req.body.role == 'Customer') {
      return Order.count({ where: { customer_id: req.body.id }, include: [{ model: User, as: 'distributor' }, { model: User, as: 'customer' }, { model: Status }] })
        .then(function (count) {
          res.status(200).json({ count: count })
        })
        .catch(handleError(res));
    }
  }

}

export function getorders(req, res) {
  var limit = 10;
  var offset = (req.body.offset - 1) * limit;

  if(req.body.sid != 0) {
    if (req.body.role == 'admin') {
      return Order.findAll({ where: { status_id: req.body.sid }, offset: offset, limit: limit, order: [['_id', 'DESC']], include: [{ model: User, as: 'distributor' }, { model: User, as: 'customer' }, { model: Status }] })
        .then(respondWithResult(res))
        .catch(handleError(res));
    }
    if (req.body.role == 'Distributor') {
      return Order.findAll({ where: { distributor_id: req.body.id, status_id: req.body.sid }, offset: offset, limit: limit, order: [['_id', 'DESC']], include: [{ model: User, as: 'distributor' }, { model: User, as: 'customer' }, { model: Status }] })
        .then(respondWithResult(res))
        .catch(handleError(res));
    }
    if (req.body.role == 'Customer') {
      return Order.findAll({ where: { customer_id: req.body.id, status_id: req.body.sid }, offset: offset, limit: limit, order: [['_id', 'DESC']], include: [{ model: User, as: 'distributor' }, { model: User, as: 'customer' }, { model: Status }] })
        .then(respondWithResult(res))
        .catch(handleError(res));
    }
  } else {
    if (req.body.role == 'admin') {
      return Order.findAll({ offset: offset, limit: limit, order: [['_id', 'DESC']], include: [{ model: User, as: 'distributor' }, { model: User, as: 'customer' }, { model: Status }] })
        .then(respondWithResult(res))
        .catch(handleError(res));
    }
    if (req.body.role == 'Distributor') {
      return Order.findAll({ where: { distributor_id: req.body.id }, offset: offset, limit: limit, order: [['_id', 'DESC']], include: [{ model: User, as: 'distributor' }, { model: User, as: 'customer' }, { model: Status }] })
        .then(respondWithResult(res))
        .catch(handleError(res));
    }
    if (req.body.role == 'Customer') {
      return Order.findAll({ where: { customer_id: req.body.id }, offset: offset, limit: limit, order: [['_id', 'DESC']], include: [{ model: User, as: 'distributor' }, { model: User, as: 'customer' }, { model: Status }] })
        .then(respondWithResult(res))
        .catch(handleError(res));
    }
  }

}

export function search(req, res) {
  var limit = 10;
  var offset = (req.body.offset - 1) * limit;
  var keyword = req.body.keyword;

  if (req.body.role == 'admin') {
    return Order.findAll({ where: { order_name: { $like: '%' + keyword + '%' }, status_id: req.body.sid }, offset: offset, limit: limit, order: [['_id', 'DESC']], include: [{ model: User, as: 'distributor' }, { model: User, as: 'customer' }, { model: Status }] })
      .then(respondWithResult(res))
      .catch(handleError(res));
  }
  if (req.body.role == 'Distributor') {
    return Order.findAll({ where: { order_name: { $like: '%' + keyword + '%' }, distributor_id: req.body.id, status_id: req.body.sid }, offset: offset, limit: limit, order: [['_id', 'DESC']], include: [{ model: User, as: 'distributor' }, { model: User, as: 'customer' }, { model: Status }] })
      .then(respondWithResult(res))
      .catch(handleError(res));
  }
  if (req.body.role == 'Customer') {
    return Order.findAll({ where: { order_name: { $like: '%' + keyword + '%' }, customer_id: req.body.id, status_id: req.body.sid }, offset: offset, limit: limit, order: [['_id', 'DESC']], include: [{ model: User, as: 'distributor' }, { model: User, as: 'customer' }, { model: Status }] })
      .then(respondWithResult(res))
      .catch(handleError(res));
  }
}

// Gets a single Order from the DB
export function show(req, res) {
  return Order.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Order in the DB
export function create(req, res) {

  var ordername = new Date().getTime();

  var cart = req.body.cart;
  var customer = req.body.customer;
  var distributor = req.body.distributor;
  var extra = req.body.extra;
  var ftotal = parseFloat(req.body.total).toFixed(2);
  var test = [];

  var d = new Date();
  var ampm = d.getHours() >= 12 ? 'pm' : 'am';
  var today = d.getDate() + '-' + (d.getMonth() + 1) + '-' + d.getFullYear() + '  ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();

  var orderObj = {
    order_name: ordername,
    order_date: new Date(),
    total: req.body.total,
    active: true,
    status_id: 2,
    customer_id: customer.User._id,
    distributor_id: distributor.User._id
  };

  Order.create(orderObj).then(function (order) {
    if (order) {

      var prod = {}, od = {}, temp = '', oRes, remaingQ;

      for (var i = 0; i < cart.length; i++) {
        prod = cart[i];

        od.order_id = order._id;
        od.order_name = order.order_name;
        od.unitprice = prod.unitprice;
        od.product_name = prod.product_name;
        od.quantity = prod.product_quantity;
        od.product_total = prod.product_total;
        od.cgst = prod.cgst,
          od.sgst = prod.sgst;
        od.igst = prod.igst;
        test.push(od);

        remaingQ = parseInt(prod.total_quantity) - prod.product_quantity;
        oRes = OrderDetail.create(od);
        BillingProduct.update({ total_quantity: remaingQ }, { where: { _id: prod._id } });

        temp = temp + '<tr><td width="20%" style="border: 1px solid #eee;">' + cart[i].product_name + '</td><td width="10%" style="border: 1px solid #eee;">₹' + cart[i].unitprice + '</td><td width="10%" style="border: 1px solid #eee;">₹' + cart[i].cgst + '</td><td width="10%" style="border: 1px solid #eee;">₹' + cart[i].sgst + '</td><td width="10%" style="border: 1px solid #eee;">₹' + cart[i].igst + '</td><td width="10%" style="border: 1px solid #eee;">' + cart[i].product_quantity + '</td><td width="10%" style="border: 1px solid #eee;">₹' + cart[i].product_total + '</td></tr>';

        if (test.length == cart.length) {
          User.findOne({ where: { _id: 1 }, include: [{ model: UserProfile, include: [{model: User}, {model: Country}, {model: State}, {model: City}] }] }).then(function (admin) {
            // createInvoice(customer, order.order_name, admin, ftotal, temp, extra, today);
            var itemp = invoiceTemp(customer, order.order_name, admin, ftotal, temp, extra, today);
            var etemp = emailTemp(customer.User.name, extra, ordername);
            pdf.create(itemp).toBuffer(function (err, buffer) {
              if (!err) {
                var bas = buffer.toString('base64')
                Order.update({ file: buffer }, { where: { _id: order._id } }).then(function () {

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
                    to: customer.User.email,
                    attachments: [{
                      filename: new Date().getTime().toString() + '.pdf',
                      content: bas,
                      encoding: 'base64'
                    }],
                    subject: 'Welcome, ' + customer.User.name + '!',
                    text: customer.User.name + ',\n\nThanks for joining our community. If you have any questions, please don\'t hesitate to send them our way. Feel free to reply to this email directly.\n\nSincerely,\nThe Management',
                    html: etemp
                  };

                  transporter.sendMail(mailOptions, (error, success) => {
                    if (error) {
                      return res.status(200).json({ msg: 'Order sucessfully placed, but' + error });
                    } else {
                      return res.status(200).json({ msg: 'Order sucessfully placed' });
                    }
                  });
                })
                  .catch(handleError(res));
              }
            });
          })
            .catch(handleError(res));
        }
      }
    }
  })
    .catch(handleError(res));
}

function createInvoice(customer, invoice, admin, total, temp, extra, date) {
  var html = '<div style="width: 95%;padding: 10px; margin:auto; font-family: Palatino Linotype, Book Antiqua, Palatino, serif; letter-spacing:1px;">\
  <div style="text-align: center; color: #263238;">\
      <h1>Enfros Solution</h1>\
      <h4>ADDRESS</h4>\
      <h4>Bangalore</h4>\
      <h3>GSTIN: '+ admin.UserProfile.gst_number + '</h3>\
  </div>\
  <div style="width: 100%; font-size: 16px;">\
    <div style="width: 50%; float: left;">\
        <p><strong style"font-weight: bold">Invoice No: </strong>'+ invoice + '</p>\
    </div>\
    <div style="width: 50%; float: right" >\
        <p><strong style"font-weight: bold">Invoice Date: </strong>'+ date + '</p>\
    </div>\
  </div><hr>\
  <div style="font-size: 16px; width: 100%; padding: 5px">\
    <div style="float: left; width: 50%;">\
        <p style="font-weight: bold; text-align: center;">Billed to</p>\
        <p><strong style"font-weight: bold">Name: </strong>'+ customer.User.name + '</p>\
        <p><strong style"font-weight: bold">Address: </strong>'+ customer.address + ', ' + customer.City.cityName + ', \
            '+ customer.State.stateName + ', ' + customer.Country.countryName + '</p>\
        <p><strong style"font-weight: bold">GSTIN: </strong>'+ customer.gst_number + '</p>\
        <p><strong style"font-weight: bold">State: </strong>'+ customer.State.stateName + '</p>\
    </div>\
    <div style="float: right; width: 50%;">\
        <p style="font-weight: bold; text-align: center;">Shipped to</p>\
        <p><strong style"font-weight: bold">Name: </strong>'+ customer.User.name + '</p>\
        <p><strong style"font-weight: bold">Address: </strong>'+ customer.address + ', ' + customer.City.cityName + ', \
            '+ customer.State.stateName + ', ' + customer.Country.countryName + '</p>\
        <p><strong style"font-weight: bold">GSTIN: </strong>'+ customer.gst_number + '</p>\
        <p><strong style"font-weight: bold">State: </strong>'+ customer.State.stateName + '</p>\
    </div>\
  </div><hr>\
  <div style="font-size: 16px; width: 100%; padding: 5px">\
    <table style="border: 1px solid #eee; border-collapse: collapse; width: 100%; text-align:center; padding-right: 10px;">\
      <thead>\
          <tr>\
              <th style="border: 1px solid #eee;">Product</th>\
              <th style="border: 1px solid #eee;">Price</th>\
              <th style="border: 1px solid #eee;">Discount</th>\
              <th style="border: 1px solid #eee;">CGST</th>\
              <th style="border: 1px solid #eee;">SGST</th>\
              <th style="border: 1px solid #eee;">IGST</th>\
              <th style="border: 1px solid #eee;">Qty</th>\
              <th style="border: 1px solid #eee;">Total</th>\
          </tr>\
      </thead>\
      <tbody>\
      <tr>'+ temp + '\
      <tr>\
          <td colspan="8" style="text-align: right; font-weight: bold;"><span style="padding-right:10px;">Total Price: ₹'+ total + '</span></td>\
      </tr>\
    </tbody>\
  </table>\
  </div>\
</div>'

  var options = {
    format: "A4", orientation: "landscape", border: {
      right: "10px",
      bottom: "20px"
    }
  };

  var mode = process.env.NODE_ENV;
  var path;
  if (mode == 'development') {
    path = './client/assets/invoice/' + invoice + '.pdf';
  } else if (mode == 'production') {
    path = './dist/client/assets/invoice/' + invoice + '.pdf';
  }
  //var path = './client/assets/invoice/'+invoice+'.pdf';

  pdf.create(html, options).toFile(path, function (err, res) {
    if (err) return console.log(err);
    sendEmailNotification(customer.User.email, customer.User.name, invoice, extra);
  });
}

function invoiceTemp(customer, invoice, admin, total, temp, extra, date) {
  var img = config.domain + 'assets/logo/logo.png';
  var address, country, state, city;
  if(admin.UserProfile.address == null) {
    address = 'address';
  } else {
    address = admin.UserProfile.address;
  }
  if(admin.UserProfile.City.cityName == null) {
    city = 'city';
  } else {
    city = admin.UserProfile.City.cityName;
  }
  if(admin.UserProfile.State.stateName == null) {
    state = 'state';
  } else {
    state = admin.UserProfile.State.stateName;
  }
  if(admin.UserProfile.Country.countryName == null) {
    country = 'country';
  } else {
    country = admin.UserProfile.Country.countryName;
  }
  // <h1>Enfros Solution</h1>\
  var html = '<div style="width: 95%;padding: 10px; margin:auto; font-family: Palatino Linotype, Book Antiqua, Palatino, serif; letter-spacing:1px;">\
  <div style="text-align: center; color: #263238;">\
      <img src='+ img + ' style="width:190px; height:80px"/><br>\
      <h4>'+ address+'</h4>\
      <h4>'+city+' ,'+state+' ,'+country+'</h4>\
      <h3>GSTIN: '+ admin.UserProfile.gst_number + '</h3>\
  </div>\
  <div style="width: 100%; font-size: 16px;">\
    <div style="width: 50%; float: left;">\
        <p><strong style"font-weight: bold">Invoice No: </strong>'+ invoice + '</p>\
    </div>\
    <div style="width: 50%; float: right" >\
        <p><strong style"font-weight: bold">Invoice Date: </strong>'+ date + '</p>\
    </div>\
  </div><hr>\
  <div style="font-size: 16px; width: 100%; padding: 5px">\
    <div style="float: left; width: 50%;">\
        <p style="font-weight: bold; text-align: center;">Billed to</p>\
        <p><strong style"font-weight: bold">Name: </strong>'+ customer.User.name + '</p>\
        <p><strong style"font-weight: bold">Address: </strong>'+ customer.address + ', ' + customer.City.cityName + ', \
            '+ customer.State.stateName + ', ' + customer.Country.countryName + '</p>\
        <p><strong style"font-weight: bold">GSTIN: </strong>'+ customer.gst_number + '</p>\
        <p><strong style"font-weight: bold">State: </strong>'+ customer.State.stateName + '</p>\
    </div>\
    <div style="float: right; width: 50%;">\
        <p style="font-weight: bold; text-align: center;">Shipped to</p>\
        <p><strong style"font-weight: bold">Name: </strong>'+ customer.User.name + '</p>\
        <p><strong style"font-weight: bold">Address: </strong>'+ customer.address + ', ' + customer.City.cityName + ', \
            '+ customer.State.stateName + ', ' + customer.Country.countryName + '</p>\
        <p><strong style"font-weight: bold">GSTIN: </strong>'+ customer.gst_number + '</p>\
        <p><strong style"font-weight: bold">State: </strong>'+ customer.State.stateName + '</p>\
    </div>\
  </div><hr>\
  <div style="font-size: 16px; width: 100%; padding: 5px">\
    <table style="border: 1px solid #eee; border-collapse: collapse; width: 100%; text-align:center; padding-right: 10px;">\
      <thead>\
          <tr>\
              <th style="border: 1px solid #eee;">Product</th>\
              <th style="border: 1px solid #eee;">Price</th>\
              <th style="border: 1px solid #eee;">CGST</th>\
              <th style="border: 1px solid #eee;">SGST</th>\
              <th style="border: 1px solid #eee;">IGST</th>\
              <th style="border: 1px solid #eee;">Qty</th>\
              <th style="border: 1px solid #eee;">Total</th>\
          </tr>\
      </thead>\
      <tbody>\
      <tr>'+ temp + '\
      <tr>\
          <td colspan="8" style="text-align: right; font-weight: bold;"><span style="padding-right:10px;">Total Price: ₹'+ total + '</span></td>\
      </tr>\
    </tbody>\
  </table>\
  </div>\
</div>'

  return html;
}

function emailTemp(name, ex, ordername) {

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
                              Thank you for placing your order with Enfros Solution.<br> Your order number is ' + ordername + '</p>\
                      <p style="font-family: Helvetica neue, Helvetica, Arial, Lucida Grande sans-serif;\
                              font-weight: normal; padding: 0; line-height: 1.7; margin-bottom: 1.3em;\
                              font-size: 15px; color: #47505e; padding-left: 40px; padding-right: 40px;"> \
                              We will confirm your order once payment is recieved. Please contact us if you have any \
                              questions regarding your order.<br><br>'+ ex.emailtext + '</p>\
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

function sendEmailNotification(email, name, file, ex) {

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
    attachments: [{ filename: file + '.pdf', path: './client/assets/invoice/' + file + '.pdf', contentType: 'application/pdf' }],
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
                              Thank you for placing your order with Enfros Solution.<br> Your order number is ' + file + '</p>\
                      <p style="font-family: Helvetica neue, Helvetica, Arial, Lucida Grande sans-serif;\
                              font-weight: normal; padding: 0; line-height: 1.7; margin-bottom: 1.3em;\
                              font-size: 15px; color: #47505e; padding-left: 40px; padding-right: 40px;"> \
                              We will confirm your order once payment is recieved. Please contact us if you have any \
                              questions regarding your order.<br><br>'+ ex.emailtext + '</p>\
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

function sendEmailNotification1(email, name, file, ex, ordername) {

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
                              Thank you for placing your order with Enfros Solution.<br> Your order number is ' + ordername + '</p>\
                      <p style="font-family: Helvetica neue, Helvetica, Arial, Lucida Grande sans-serif;\
                              font-weight: normal; padding: 0; line-height: 1.7; margin-bottom: 1.3em;\
                              font-size: 15px; color: #47505e; padding-left: 40px; padding-right: 40px;"> \
                              We will confirm your order once payment is recieved. Please contact us if you have any \
                              questions regarding your order.<br><br>'+ ex.emailtext + '</p>\
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

// Upserts the given Order in the DB at the specified ID
export function upsert(req, res) {
  if (req.body._id) {
    Reflect.deleteProperty(req.body, '_id');
  }

  return Order.upsert(req.body, {
    where: {
      _id: req.params.id
    }
  })
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing Order in the DB
export function patch(req, res) {
  if (req.body._id) {
    Reflect.deleteProperty(req.body, '_id');
  }
  return Order.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Order from the DB
export function destroy(req, res) {
  return Order.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}

export function updatestatus(req, res) {
  var dObj = {
    status_id: req.body.status
  }
  if (req.body.status == 3) {
    dObj['ship_date'] = new Date();
    return Order.update(dObj, {
      where: {
        _id: req.body.id
      }
    })
      .then(respondWithResult(res))
      .catch(handleError(res));
  }
  if (req.body.status == 4) {
    dObj['delivery_date'] = new Date();
    return Order.update(dObj, {
      where: {
        _id: req.body.id
      }
    })
      .then(respondWithResult(res))
      .catch(handleError(res));
  }

  if (req.body.status == 5) {
    return Order.update(dObj, {
      where: { _id: req.body.id }
    })
      .then(respondWithResult(res))
      .catch(handleError(res));
  }

}


export function createQuotation(req, res) {
  var temp = req.body.template;
  var img = config.domain + 'assets/images/logo.png';

  var html = '<div style="width: 95%;padding: 10px; margin:auto; text-align: center; letter-spacing:1px; font-size: 20px;">\
  <div style="width: 95%; text-align: right; ">\
      <img src='+ img + ' style="width:190px; height:80px"/><br>\
  </div>'+ temp + '</div>';

  var options = {
    format: "A4", orientation: "landscape", border: {
      right: "10px",
      bottom: "20px"
    }
  };

  var mode = process.env.NODE_ENV;
  var path;
  if (mode == 'development') {
    path = './client/assets/invoice/test.pdf';
  } else if (mode == 'production') {
    var path = './dist/client/assets/invoice/test.pdf';
  }
  //var path = './client/assets/invoice/'+invoice+'.pdf';

  pdf.create(html, options).toFile(path, function (err, res) {
    if (err) return console.log(err);
  });
}


{/* <div style="width: 100%; font-size: 16px;">\
    <div style="width: 50%; float: left;">\
        <p><strong style"font-weight: bold">Reverse Charges: </strong>'+ extra. reversecharge+'</p>\
        <p><strong style"font-weight: bold">Invoice No: </strong>'+ invoice+'</p>\
        <p><strong style"font-weight: bold">Invoice Date: </strong>'+ date +'</p>\
        <p><strong style"font-weight: bold">State: </strong>'+ customer.State.stateName+'</p>\
    </div>\
    <div style="width: 50%; float: right" >\
        <p><strong style"font-weight: bold">Transportation Mode: </strong>'+ extra. transportationmode+'</p>\
        <p><strong style"font-weight: bold">Vehicle Number: </strong>'+ extra. vechiclenumber+'</p>\
        <p><strong style"font-weight: bold">Date of Supply: </strong>'+ extra. dateofsupply+'</p>\
        <p><strong style"font-weight: bold">Place of Supply: </strong>'+ extra. placeofsupply+'</p>\
    </div>\
  </div><hr>\ */}
