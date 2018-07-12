'use strict';
const angular = require('angular');

/*@ngInject*/
export function myServiceService() {
  var currentuser, cart, customer, distributor;
  
  this.getCurrentUser = function() {
    return currentuser;
  }

  this.saveCurrentUser = function(val) {
    currentuser = val;
  }

  this.getCartInfo = function() { 
    return cart;
  }

  this.saveCartInfo = function(val) {
    cart = val;
  }

  this.getDistributorList = function() {
    return distributor;
  }

  this.saveDistributorList = function(val) {
    distributor = val;
  }

  this.getCustomerList = function() {
    return customer;
  }

  this.saveCustomerList = function(val) {
    customer = val;
  }
}

export default angular.module('enfrosProjApp.myService', [])
  .service('myService', myServiceService)
  .name;
