'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './printinvoice.routes';

export class PrintinvoiceComponent {
  $http;
  $state;
  cInfo;
  gStatus;
  finaltotal;
  custInfo;
  distInfo;
  admin;
  quantityNum = 1;

  /*@ngInject*/
  constructor($http, $state) {
    this.$http = $http;
    this.$state = $state;

    this.cInfo = this.$state.params.cart;
    this.gStatus = this.$state.params.gStatus;
    this.finaltotal = this.$state.params.finaltotal;
    this.custInfo = this.$state.params.custInfo;
    this.distInfo = this.$state.params.distInfo;
    this.admin = this.$state.params.admin;

    console.log(this.admin);
    console.log(this.custInfo);

    
  }
}

export default angular.module('enfrosProjApp.printinvoice', [uiRouter])
  .config(routes)
  .component('printinvoice', {
    template: require('./printinvoice.html'),
    controller: PrintinvoiceComponent,
    controllerAs: 'printinvoiceCtrl'
  })
  .name;
