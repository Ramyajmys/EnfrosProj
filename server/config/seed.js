/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';
import sqldb from '../sqldb';
import config from './environment/';

export default function seedDatabaseIfNeeded() {
  if(config.seedDB) {
    let User = sqldb.User;
    let Role = sqldb.Role;
    let Country = sqldb.Country;
    let State = sqldb.State;
    let City = sqldb.City;
    let Category = sqldb.ProductCategory;

    User.destroy({ where: {} })
      .then(() => User.bulkCreate([{
        provider: 'local',
        role: 'admin',
        name: 'Admin',
        email: 'admin@example.com',
        password: 'admin'
      }])
        .then(() => console.log('finished populating users'))
        .catch(err => console.log('error populating users', err)));

    Role.destroy({ where: {} })
      .then(() => Role.bulkCreate([{
        roleName: 'Distributor',
        active: true
      }, {
        roleName: 'Customer',
        active: true
      }])
        .then(() => console.log('finished populating roles'))
        .catch(err => console.log('error populating roles', err)));

    Category.destroy({where: {} })
      .then(() => Category.bulkCreate([{
        _id: 1,
        category_name: 'EPC',
        category_description: 'EPC'
      }, {
        _id: 2,
        category_name: 'SOLAR PANELS',
        category_description: 'Solar panels'
      }, {
        _id: 3,
        category_name: 'SOLAR INVERTERS',
        category_description: 'Solar inverters'
      }, {
        _id: 4,
        category_name: 'SOLAR KITS',
        category_description: 'Solar kits'
      }, {
        _id: 5,
        category_name: 'BOS',
        category_description: 'battery specifications'
      }, {
        _id: 6,
        category_name: 'KNOWLEDGE',
        category_description: 'Knowledge'
      }])
    )
 
    Country.destroy({ where: {} })
      .then(() => Country.bulkCreate([{
        _id: 1,
        countryName: 'INDIA',
        countryCode: 'IND',
        active: true
      }])
        .then(() => console.log('finished populating country'))
        .catch(err => console.log('error populating country', err)));

    setTimeout(function() {
      statedata()
    }, 2000);

    function statedata() {
      State.destroy({ where: {} })
      .then(() => State.bulkCreate([{
        _id: 1,
        stateName: 'Karnataka',
        country_id: 1,
        active: true
      }])
        .then(() => console.log('finished populating state'))
        .catch(err => console.log('error populating state', err)));

      setTimeout(function() {
        citydata()
      }, 2000);
    }

    function citydata(callback) {
      City.destroy({ where: {} })
      .then(() => City.bulkCreate([{
        _id: 1,
        cityName: 'Mysore',
        state_id: 1,
        active: true
      }])
        .then(() => console.log('finished populating city'))
        .catch(err => console.log('error populating city', err)));
    }
  
  }
}
