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
    let UserProfile = sqldb.UserProfile;
    let Role = sqldb.Role;
    let Country = sqldb.Country;
    let State = sqldb.State;
    let City = sqldb.City;
    let Category = sqldb.ProductCategory;
    let HSN = sqldb.HSN;
    let Status = sqldb.Status;

    User.destroy({ where: {} })
      .then(() => User.bulkCreate([{
        _id: 1,
        provider: 'local',
        role: 'admin',
        name: 'Admin',
        email: 'admin@example.com',
        mobilenumber: '9998886660',
        password: 'admin'
      }, {
        _id: 2,
        provider: 'local',
        role: 'Customer',
        name: 'Bhaskar',
        email: 'bhaskar@enfros.com',
        mobilenumber: '9998886661',
        password: 'User@1234'
      }, {
        _id: 3,
        provider: 'local',
        role: 'Customer',
        name: 'Kumari',
        email: 'kumari@enfros.com',
        mobilenumber: '9998886662',
        password: 'User@1234'
      }, {
        _id: 4,
        provider: 'local',
        role: 'Customer',
        name: 'Shiva',
        email: 'shiva@enfros.com',
        mobilenumber: '9998886663',
        password: 'User@1234'
      }, {
        _id: 5,
        provider: 'local',
        role: 'Customer',
        name: 'Geetha',
        email: 'geetha@enfros.com',
        mobilenumber: '9998886664',
        password: 'User@1234'
      }, {
        _id: 6,
        provider: 'local',
        role: 'Distributor',
        name: 'Ramya',
        email: 'ramya@enfros.com',
        mobilenumber: '9998886665',
        password: 'User@1234'
      }, {
        _id: 7,
        provider: 'local',
        role: 'Distributor',
        name: 'Sandeep',
        email: 'sandeep@enfros.com',
        mobilenumber: '9998886666',
        password: 'User@1234'
      }, {
        _id: 8,
        provider: 'local',
        role: 'Distributor',
        name: 'Ranga',
        email: 'ranga@enfros.com',
        mobilenumber: '9998886667',
        password: 'User@1234'
      }])
        .then(() => console.log('finished populating users'))
        .catch(err => console.log('error populating users', err)));

    setTimeout(function() {
      userprofile()
    }, 1500);

    function userprofile() {
      UserProfile.destroy({ where: {} })
      .then(() => UserProfile.bulkCreate([{
        gst_number: '123456',
        user_id: 1
      }, {
        gst_number: '232344',
        user_id: 2
      }, {
        gst_number: '124645',
        user_id: 3
      }, {
        gst_number: '767677',
        user_id: 4
      }, {
        gst_number: '128756',
        user_id: 5
      }, {
        gst_number: '456566',
        user_id: 6
      }, {
        gst_number: '765576',
        user_id: 7
      }, {
        gst_number: '878787',
        user_id: 8
      }])
        .then(() => console.log('finished userprofile'))
        .catch(err => console.log('error userprofile', err)));  
    }
    
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

    HSN.destroy({ where: {} })
      .then(() => HSN.bulkCreate([{
        hsn_code: 'AB001',
        hsn_percentage: 28
      }, {
        hsn_code: 'AB002',
        hsn_percentage: 18
      }, {
        hsn_code: 'AB003',
        hsn_percentage: 5
      }])
        .then(() => console.log('finished populating hsn'))
        .catch(err => console.log('error populating hsn', err)))

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
 
    Status.destroy({ where: {} })
      .then(() => Status.bulkCreate([{
        _id: 1,
        status_name: 'Created',
        status_info: 'Intial state',
        active: false
      }, {
        _id: 2,
        status_name: 'Assigned',
        status_info: 'Assigned to distributor',
        active: false
      }, {
        _id: 3,
        status_name: 'Shipped',
        status_info: 'Shipped to customer',
        active: false
      }, {
        _id: 4,
        status_name: 'Delivered',
        status_info: 'Delivered to customer',
        active: false
      }, {
        _id: 5,
        status_name: 'Complete',
        status_info: 'Order completed',
        active: false
      }, {
        _id: 6,
        status_name: 'Return',
        status_info: 'Order returned by customer',
        active: false
      }])
        .then(() => console.log('finished populating Status'))
        .catch(err => console.log('error populating Status', err)));

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
    }, 1000);

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
      }, 1000);
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
