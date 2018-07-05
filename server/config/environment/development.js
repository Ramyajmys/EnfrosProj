'use strict';
/*eslint no-process-env:0*/

// Development specific configuration
// ==================================
module.exports = {

  // Sequelize connection opions

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

  // Seed database on startup
  seedDB: false

};
