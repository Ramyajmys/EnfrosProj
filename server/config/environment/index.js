'use strict';
/*eslint no-process-env:0*/

import path from 'path';
import _ from 'lodash';

/*function requiredProcessEnv(name) {
  if(!process.env[name]) {
    throw new Error('You must set the ' + name + ' environment variable');
  }
  return process.env[name];
}*/

if (process.env.NODE_ENV == 'development') {
  var all = {
    env: process.env.NODE_ENV,

    // Root path of server
    root: path.normalize(`${__dirname}/../../..`),

    // Browser-sync port
    browserSyncPort: process.env.BROWSER_SYNC_PORT || 3000,

    // Server port
    port: process.env.PORT || 9000,

    // Server IP
    ip: process.env.IP || '0.0.0.0',

    // Should we populate the DB with sample data?
    seedDB: false,

    // Secret for session, you will want to change this and make it an environment variable
    secrets: {
      session: 'testproj-secret'
    },

    service: 'Godaddy',
    mailHost: 'smtpout.secureserver.net',
    mailPort: 465,
    secureConnection: true,
    mailSenderId: 'info@enfros.co.in',
    mailSecure: false,
    email: 'info@enfros.co.in',
    password: 'abcd12345',

    default_password: 'User@1234',
    domain: 'http://localhost:3000/',

    sms_accountSid: 'AC2cc3d2acf5b98721cef6c2274231bc17',
    sms_authToken: '6bc173cb73158a5d9bc0c402b47ecf12',
    sms_senderNumber: '+12345678901'
  };
} else if (process.env.NODE_ENV == 'production') {
  // All configurations will extend these options
  // ============================================
  var all = {
    env: process.env.NODE_ENV,

    // Root path of server
    root: path.normalize(`${__dirname}/../../..`),

    // Browser-sync port
    browserSyncPort: process.env.BROWSER_SYNC_PORT || 3000,

    // Server port
    port: process.env.PORT || 9000,

    // Server IP
    ip: process.env.IP || '0.0.0.0',

    // Should we populate the DB with sample data?
    seedDB: false,

    // Secret for session, you will want to change this and make it an environment variable
    secrets: {
      session: 'testproj-secret'
    },

    service: 'Godaddy',
    mailHost: 'smtpout.secureserver.net',
    mailPort: 465,
    secureConnection: true,
    mailSenderId: 'info@enfros.co.in',
    mailSecure: false,
    email: 'info@enfros.co.in',
    password: 'abcd12345',

    default_password: 'User@1234',
    domain: 'http://159.65.157.148:80/',

    sms_accountSid: 'AC2cc3d2acf5b98721cef6c2274231bc17',
    sms_authToken: '6bc173cb73158a5d9bc0c402b47ecf12',
    sms_senderNumber: '+12345678901'
  };
}


// Export the config object based on the NODE_ENV
// ==============================================
module.exports = _.merge(
  all,
  require('./shared'),
  require(`./${process.env.NODE_ENV}.js`) || {});
