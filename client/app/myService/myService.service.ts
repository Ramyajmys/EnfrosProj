'use strict';
const angular = require('angular');

/*@ngInject*/
export function myServiceService($http, $cookies, Auth) {
  var cart = [], cart2=[], customer_list, distributor_list, invoice = false, customer_info, distributor_info, gstatus, category_list;
  var productobj;

  this.getBillProduct = function () {
    return productobj;
  }
  this.saveBillProduct = function (val) {
    productobj = val;
  }

  this.getCategories = function () {
    return category_list;
  }
  this.saveCategories = function (val) {
    category_list = val;
  }

  this.getGstatus = function () {
    return gstatus;
  }
  this.saveGstatus = function (val) {
    gstatus = val;
  }

  this.getCartInfo = function () {
    return cart;
  }

  this.saveCartInfo = function (val) {
    cart = val;
  }

  this.getCartInfo2 = function () {
    return cart2;
  }

  this.saveCartInfo2 = function (val) {
    cart2 = val;
  }

  this.getDistributorList = function () {
    return distributor_list;
  }

  this.saveDistributorList = function (val) {
    distributor_list = val;
  }

  this.getCustomerList = function () {
    return customer_list;
  }

  this.saveCustomerList = function (val) {
    customer_list = val;
  }

  this.getInvoiceStatus = function () {
    return invoice;
  }

  this.saveInvoiceStatus = function (val) {
    invoice = val;
  }

  this.getDistributorInfo = function () {
    return distributor_info;
  }

  this.saveDistributorInfo = function (val) {
    distributor_info = val;
  }

  this.getCustomerInfo = function () {
    return customer_info;
  }

  this.saveCustomerInfo = function (val) {
    customer_info = val;
  }
}

export default angular.module('enfrosProjApp.myService', [])
  .service('myService', myServiceService)
  .name;
