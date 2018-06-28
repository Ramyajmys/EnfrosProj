'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './customerDashboard.routes';

export class CustomerDashboardComponent {
  /*@ngInject*/
  constructor() {
  }
}

export default angular.module('enfrosProjApp.customerDashboard', [uiRouter])
  .config(routes)
  .component('customerDashboard', {
    template: require('./customerDashboard.html'),
    controller: CustomerDashboardComponent,
    controllerAs: 'customerDashboardCtrl'
  })
  .name;
