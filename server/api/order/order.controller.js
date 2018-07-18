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
import {Order} from '../../sqldb';
import {OrderDetail} from '../../sqldb';
import config from '../../config/environment';

var fs = require('fs');
var pdf = require('html-pdf');
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

// Gets a list of Orders
export function index(req, res) {
  return Order.findAll()
    .then(respondWithResult(res))
    .catch(handleError(res));
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
  // return Order.create(req.body)
  //   .then(respondWithResult(res, 201))
  //   .catch(handleError(res));

  const uniqueRandom = require('unique-random');
  const rand = uniqueRandom(1, 10000000000);
  var ordername = rand();

  var cart = req.body.cart;
  var customer = req.body.customer;
  var distributor = req.body.distributor;
  var admin = req.body.admin;
  var test = [];
  var gStatus = req.body.gStatus;

  var orderObj = {
    order_name: ordername,
    order_date: new Date(),
    total: req.body.total,
    discount: null,
    payment_details: 'COD',
    active: true,
    paid_flag: false,
    status_id: 1,
    customer_id: customer.User._id,
    distributor_id: distributor.User._id
  };

  return Order.create(orderObj).then(function(order) {
    if(order) {

      var prod = {}, od = {}, temp = '';
  //     var temp = '<tr>\
  //     <td>\
  //         <div>\
  //             <div>\
  //                 <p>'+ cart[i].product_name +'</p>\
  //             </div> \
  //         </div>\
  //     </td>\
  //     <td><div><p>₹'+ cart[i].unitprice +'</p></div></td>\
  //     <td><div><p>₹'+ cart[i].product_discount +'</p></div></td>\
  //     <td><div><p>₹'+ cart[i].tax/2 +'</p></div></td>\
  //     <td><div><p>₹'+ cart[i].tax/2 +'</p></div></td>\
  //     <td><div><p>₹'+ cart[i].tax/2 +'</p></div></td>\
  //     <td><div><p>'+ cart[i].quantity +'</p></div></td>\
  //     <td><div><p>₹'+cart[i].product_total+'</p></div></td>\
  // </tr>';

      for(var i = 0; i< cart.length; i++) {
        prod = cart[i];
        
        od.order_id = order._id;
        od.order_name = order.order_name;
        od.product_name = prod.product_name;
        od.quantity = prod.quantity;
        od.product_total = prod.product_total;
        od.product_discount = prod.product_discount;
        test.push(od);

// temp = temp + '<tr>\
// <td>\
//     <div>\
//         <div>\
//             <p>'+ cart[i].product_name +'</p>\
//         </div> \
//     </div>\
// </td>\
// <td><div><p>₹'+ cart[i].unitprice +'</p></div></td>\
// <td><div><p>₹'+ cart[i].product_discount +'</p></div></td>\
// <td><div><p>₹'+ cart[i].tax/2 +'</p></div></td>\
// <td><div><p>₹'+ cart[i].tax/2 +'</p></div></td>\
// <td><div><p>₹'+ cart[i].tax/2 +'</p></div></td>\
// <td><div><p>'+ cart[i].quantity +'</p></div></td>\
// <td><div><p>₹'+cart[i].product_total+'</p></div></td>\
// </tr>';
if(gStatus) {
  temp = temp + '<tr><td><div><div><p>'+ cart[i].product_name +'</p></div></div></td><td><div><p>₹'+ cart[i].unitprice +'</p></div></td><td><div><p>₹'+ cart[i].product_discount +'</p></div></td><td><div><p>₹'+ cart[i].tax/2 +'</p></div></td><td><div><p>₹'+ cart[i].tax/2 +'</p></div></td><td><div><p>₹0</p></div></td><td><div><p>'+ cart[i].quantity +'</p></div></td><td><div><p>₹'+cart[i].product_total+'</p></div></td></tr>';
} else {
  temp = temp + '<tr><td><div><div><p>'+ cart[i].product_name +'</p></div></div></td><td><div><p>₹'+ cart[i].unitprice +'</p></div></td><td><div><p>₹'+ cart[i].product_discount +'</p></div></td><td><div><p>₹'+ cart[i].tax/2 +'</p></div></td><td><div><p>₹0</p></div></td><td><div><p>₹'+ cart[i].tax/2 +'</p></div></td><td><div><p>'+ cart[i].quantity +'</p></div></td><td><div><p>₹'+cart[i].product_total+'</p></div></td></tr>';
}




        OrderDetail.create(od).then(function() {
          
          if(test.length == cart.length) {
            createInvoice(customer, distributor, cart, order.order_name, admin, req.body.total, temp);
            return res.status(200).json({msg: 'Success'});
            
          }
        })
        .catch(handleError(res));
      }
    }
  })
  .catch(handleError(res));
}

function createInvoice(customer, distributor, cart, invoice, admin, total, temp) {
  var html = '<div style="width: 100%;">\
  <div style="text-align: center;">\
      <h1>Enfros Solution</h1>\
      <h4>ADDRESS</h4>\
      <h4>Bangalore</h4>\
      <h3>GSTIN:'+ admin.gst_number +'</h3>\
  </div><hr>\
  <div style="width: 100%; font-size: 17px;">\
    <div style="width: 50%; float: left">\
        <p>Reverse Charges:</p>\
        <p>Invoice No:'+ invoice+'</p>\
        <p>Invoice Date:'+ invoice +'</p>\
        <p>State: Karnataka</p>\
    </div>\
    <div style="width: 50%; float: right" >\
        <p>Transportation Mode:</p>\
        <p>Vehicle Number:</p>\
        <p>Date of Supply:</p>\
        <p>Place of Supply:</p>\
    </div>\
  </div><hr>\
  <div style="font-size: 17px; width: 100%; padding: 5px">\
  <div style="float: left; width: 50%; ">\
      <p style="font-weight: bold; text-align: center;">Details of Receiver / Billed to</p>\
      <p>Name: '+ customer.User.name +'</p>\
      <p>Address: '+ customer.address +', '+ customer.City.cityName +', \
          '+ customer.State.stateName+', '+ customer.Country.countryName+'</p>\
      <p>GSTIN: '+ customer.gst_number+'</p>\
      <p>State: '+ customer.State.stateName+'</p>\
  </div>\
  <div style="float: right; width: 50%; ">\
      <p style="font-weight: bold; text-align: center;">Details of Consignee / Shipped to</p>\
      <p>Name: '+ customer.User.name +'</p>\
      <p>Address: '+ customer.address +', '+ customer.City.cityName +', \
          '+ customer.State.stateName+', '+ customer.Country.countryName+'</p>\
      <p>GSTIN: '+ customer.gst_number+'</p>\
      <p>State: '+ customer.State.stateName+'</p>\
  </div>\
  </div><hr>\
  <table class="table table-bordered">\
    <thead>\
        <tr>\
            <th>Product</th>\
            <th>Price</th>\
            <th>Discount</th>\
            <th>CGST</th>\
            <th>SGST</th>\
            <th>IGST</th>\
            <th>Quantity</th>\
            <th>Total</th>\
        </tr>\
    </thead>\
    <tbody>\
    <tr>'+temp+'\
    <tr>\
        <td colspan="8" style="text-align: right; font-weight: bold;">Total Price: ₹'+total+'</td>\
    </tr>\
  </tbody>\
</table>\
</div>'


  var options = { format: 'A4'};
  var path = './client/assets/invoice/'+invoice+'.pdf';

  pdf.create(html, options).toFile(path, function(err, res) {
    if (err) return console.log(err);
    sendEmailNotification(customer.User.email, customer.User.name, invoice);
  });
}


function sendEmailNotification(email, name, file) {

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
    attachments: [{filename: file+'.pdf', path:'./client/assets/invoice/'+file+'.pdf', contentType: 'application/pdf'}],
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
                              Thank you for placing your order with Enfros Solution.<br> Your order number is' + file + '</p>\
                      <p style="font-family: Helvetica neue, Helvetica, Arial, Lucida Grande sans-serif;\
                              font-weight: normal; padding: 0; line-height: 1.7; margin-bottom: 1.3em;\
                              font-size: 15px; color: #47505e; padding-left: 40px; padding-right: 40px;"> \
                              We will confirm your order once payment is recieved. Please contact us if you have any \
                              questions regarding your order.</p>\
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
  if(req.body._id) {
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
  if(req.body._id) {
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
