'use strict';
/*eslint no-process-env:0*/

// Production specific configuration
// =================================
module.exports = {
  // Server IP
  ip: process.env.OPENSHIFT_NODEJS_IP
    || process.env.ip
    || undefined,

  // Server port
  port: process.env.OPENSHIFT_NODEJS_PORT
    || process.env.PORT
    || 80,

  sequelize: {
    uri: 'postgres://postgres:test1234@localhost:5432/sample',
    options: {
      logging: false,
      //storage: 'dev.sqlite',
      define: {
        timestamps: false
      }
    }
  },
  // sequelize: {
  //   uri: process.env.SEQUELIZE_URI
  //     || 'sqlite://',
  //   options: {
  //     logging: false,
  //     storage: 'dist.sqlite',
  //     define: {
  //       timestamps: false
  //     }
  //   }
  // }
};
