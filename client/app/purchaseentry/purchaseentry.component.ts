'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './purchaseentry.routes';

export class PurchaseentryComponent {
  $state;
  product;

  /*@ngInject*/
  constructor($state) {
    this.$state = $state;

    if(this.$state.params.prod != null) {
      this.product = this.$state.params.prod;
      console.log(this.product);
    }
  }
}

export default angular.module('enfrosProjApp.purchaseentry', [uiRouter])
  .config(routes)
  .component('purchaseentry', {
    template: require('./purchaseentry.html'),
    controller: PurchaseentryComponent,
    controllerAs: 'purchaseentryCtrl'
  })
  .name;
