'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('customerDashboard', {
      url: '/customerDashboard',
      template: '<customer-dashboard></customer-dashboard>',
      authenticate: 'Customer'
    });
}
