'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('distributorDashboard', {
      url: '/distributorDashboard',
      template: '<distributor-dashboard></distributor-dashboard>',
      authenticate: 'Distributor'
    });
}
