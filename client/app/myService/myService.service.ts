'use strict';
const angular = require('angular');

/*@ngInject*/
export function myServiceService($http, $cookies, Auth) {
  var cart = [], customer_list, distributor_list, invoice = false, customer_info, distributor_info;



  this.getCartInfo = function() { 
    return cart;
  }

  this.saveCartInfo = function(val) {
    cart = val;
  }

  this.getDistributorList = function() {
    return distributor_list;
  }

  this.saveDistributorList = function(val) {
    distributor_list = val;
  }

  this.getCustomerList = function() {
    return customer_list;
  }

  this.saveCustomerList = function(val) {
    customer_list = val;
  }

  this.getInvoiceStatus = function() {
    return invoice;
  }

  this.saveInvoiceStatus = function(val) {
    invoice = val;
  }

  this.getDistributorInfo = function() {
    return distributor_info;
  }

  this.saveDistributorInfo = function(val) {
    distributor_info = val;
  }

  this.getCustomerInfo = function() {
    return customer_info;
  }

  this.saveCustomerInfo = function(val) {
    customer_info = val;
  }
}

export default angular.module('enfrosProjApp.myService', [])
  .service('myService', myServiceService)
  .name;
