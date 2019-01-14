'use strict';

import { User } from '../../sqldb';
import config from '../../config/environment';
import jwt from 'jsonwebtoken';
import { UserProfile } from '../../sqldb';
var nodemailer = require('nodemailer');
import crypto from 'crypto';
var twilio = require('twilio');

// var base64 = require('base-64');
// var utf8 = require('utf8');
// var fs = require('fs'); 

function validationError(res, statusCode) {
  statusCode = statusCode || 422;
  return function (err) {
    return res.status(statusCode).json(err);
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function (err) {
    return res.status(statusCode).send(err);
  };
}

/**
 * Get list of users
 * restriction: 'admin'
 */
export function index(req, res) {
  return User.findAll({
    where: { role: req.body.role },
    attributes: [
      '_id',
      'name',
      'email',
      'role',
      'mobilenumber',
      'active',
      'provider'
    ], include: [{ model: UserProfile }], order: [['name', 'ASC']]
  })
    .then(users => {
      res.status(200).json(users);
    })
    .catch(handleError(res));
}

function sendEmailNotification(id, email, name, msg) {

  var transporter = nodemailer.createTransport({
    service: config.service,
    host: config.mailHost,
    port: config.mailPort,
    secureConnection: config.secureConnection,
    auth: {
      user: config.email,
      pass: config.password
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  var id = String(id);
  var cipher = crypto.createCipher("aes192", "password");
  var encrypted = cipher.update(id, 'utf8', 'hex') + cipher.final('hex');
  var url = config.domain + 'setpassword/' + encrypted;

  var mailOptions = {
    from: config.mailSenderId,
    to: email,
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
                              ' + msg + '</p>\
                      <p style="font-family: Helvetica neue, Helvetica, Arial, Lucida Grande sans-serif;\
                              font-weight: normal; padding: 0; line-height: 1.7; margin-bottom: 1.3em;\
                              font-size: 15px; color: #47505e; text-align: center; padding-left: 40px; padding-right: 40px;">\
                              <a href="' + url + '" style="word-wrap: break-word; color: #009688;\
                                  font-family: Helvetica neue, Helvetica, Arial, Lucida Grande sans-serif;\
                                  text-decoration: none; background-color: #009688; border: solid #009688;\
                                  line-height: 2; max-width: 100%; font-size: 14px; padding: 8px 40px 8px 40px;\
                                  margin-top: 30px; margin-bottom: 30px; font-weight: 600; display: inline-block;\
                                  border-radius: 30px; margin-left: auto; margin-right: auto; text-align: center;\
                                  color: #ffffff;">Activate</a></p>\
                      <p style="font-family: Helvetica neue, Helvetica, Arial, Lucida Grande sans-serif;\
                              font-weight: normal; padding: 0; line-height: 1.7; margin-bottom: 1.3em;\
                              font-size: 15px; color: #47505e; padding-left: 40px; padding-right: 40px;"> \
                              Once Activated, you will be able to login to your account with your Email address</p>\
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

/**
 * Creates a new user
 */
export function create(req, res) {
  var userObj = {
    name: req.body.name,
    email: req.body.email,
    mobilenumber: req.body.mobilenumber,
    role: req.body.role
  }

  var profile = {
    gst_number: req.body.gst_number,
    address: req.body.address,
    zip: req.body.zip,
    profilepic: req.body.profilepic,
    country_id: req.body.country_id,
    state_id: req.body.state_id,
    city_id: req.body.city_id
  }

  // return User.create(userObj).then(function(user) {
  //   if(user) {
  //     profile['user_id'] = user._id;
  //     UserProfile.create(profile).then(function () {
  //       var msg = 'You are successfully added. Please activate your account by clicking the button below';
  //       sendEmailNotification(user._id, user.email, req.body.name, msg);
  //       res.json({ message: 'Successfully Added' });
  //     })
  //     .catch(handleError(res));
  //   }
  // })
  // .catch(validationError(res));

  var newUser = User.build(userObj);
  newUser.setDataValue('provider', 'local');
  newUser.setDataValue('password', config.default_password);

  return newUser.save()
    .then(function (user) {
      profile['user_id'] = user._id;
      UserProfile.create(profile).then(function () {
        var msg = 'You are successfully added. Please activate your account by clicking the button below';
        sendEmailNotification(user._id, user.email, req.body.name, msg);
        res.json({ message: 'Successfully Added' });
      })
        .catch(handleError(res));
    })
    .catch(validationError(res));


}

/**
 * Update a new user
 */
export function updateUser(req, res) {
  var id = req.body._id;
  var userObj = {
    name: req.body.name,
    email: req.body.email,
    mobilenumber: req.body.mobilenumber,
  };
  var userProfile = {
    gst_number: req.body.gst_number,
    address: req.body.address,
    city_id: req.body.city_id,
    state_id: req.body.state_id,
    country_id: req.body.country_id,
    zip: req.body.zip,
    profilepic: req.body.profilepic
  };
  return User.update(userObj, { where: { _id: id } }).then(function () {
    return UserProfile.update(userProfile, { where: { user_id: id } }).then(function () {
      return res.status(200).json({ message: 'User Details Updated' });
    })
      .catch(validationError(res));
  })
    .catch(validationError(res));
}


/**
 * Get a single user
 */
export function show(req, res, next) {
  var userId = req.params.id;

  return User.find({
    where: {
      _id: userId
    }
  })
    .then(user => {
      if (!user) {
        return res.status(404).end();
      }
      res.json(user.profile);
    })
    .catch(err => next(err));
}

/**
 * Deletes a user
 * restriction: 'admin'
 */
export function destroy(req, res) {
  return User.destroy({ where: { _id: req.params.id } })
    .then(function () {
      res.status(204).end();
    })
    .catch(handleError(res));
}

/**
 * Change a users password
 */
export function changePassword(req, res) {
  var userId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  return User.find({
    where: {
      _id: userId
    }
  })
    .then(user => {
      if (user.authenticate(oldPass)) {
        user.password = newPass;
        return user.save()
          .then(() => {
            sendSMS(user.mobilenumber)
            res.status(204).end();
          })
          .catch(validationError(res));
      } else {
        return res.status(403).end();
      }
    });
}

function sendSMS(mobilenumber) {

  var accountSid = config.sms_accountSid
  var authToken = config.sms_authToken

  var client = new twilio(accountSid, authToken);

  client.messages.create({
    body: 'Your password successfully changed.',
    to: '+91' + mobilenumber,  // Text this number
    from: config.sms_senderNumber
  })
    .then((message) => console.log(message.sid));
}

/**
 * Get my info
 */
export function me(req, res, next) {
  var userId = req.user._id;

  return User.find({
    where: {
      _id: userId
    },
    attributes: [
      '_id',
      'name',
      'email',
      'role',
      'provider',
      'mobilenumber'
    ], include: [{ model: UserProfile }]
  })
    .then(user => { // don't ever give out the password or salt
      if (!user) {
        return res.status(401).end();
      }
      res.json(user);
    })
    .catch(err => next(err));
}

/**
 * Authentication callback
 */
export function authCallback(req, res) {
  res.redirect('/');
}

export function createPassword(req, res) {
  var id = req.body.userid;
  var userId = String(id);

  var decipher = crypto.createDecipher('aes192', 'password')
  var decrypted = decipher.update(userId, 'hex', 'utf8') + decipher.final('utf8');
  var newPassword = req.body.newPassword;
  var defaultIterations = 10000;
  var defaultKeyLength = 64;

  return User.findOne({ where: { _id: decrypted, active: false } }).then(function (response) {
    var salt = new Buffer(response.salt, 'base64');
    var encodedPwd = crypto.pbkdf2Sync(newPassword, salt, defaultIterations, defaultKeyLength, 'sha512').toString('base64');
    var details = {
      password: encodedPwd,
      active: true
    }
    return User.update(details, { where: { _id: decrypted } }).then(function (response) {
      return res.status(200).json({ message: 'Password Created. Now You Can Login !!' });
    })
      .catch(handleError(res));
  })
    .catch(handleError(res));
}