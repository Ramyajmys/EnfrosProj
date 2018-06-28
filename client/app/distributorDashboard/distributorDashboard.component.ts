'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './distributorDashboard.routes';

export class DistributorDashboardComponent {
  /*@ngInject*/
  constructor() {
  }
}

export default angular.module('enfrosProjApp.distributorDashboard', [uiRouter])
  .config(routes)
  .component('distributorDashboard', {
    template: require('./distributorDashboard.html'),
    controller: DistributorDashboardComponent,
    controllerAs: 'distributorDashboardCtrl'
  })
  .name;
