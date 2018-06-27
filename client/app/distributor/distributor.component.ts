'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './distributor.routes';

export class DistributorComponent {
  /*@ngInject*/
  constructor() {
  }
}

export default angular.module('enfrosProjApp.distributor', [uiRouter])
  .config(routes)
  .component('distributor', {
    template: require('./distributor.html'),
    controller: DistributorComponent,
    controllerAs: 'distributorCtrl'
  })
  .name;
