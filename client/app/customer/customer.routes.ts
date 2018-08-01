'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('customer', {
      url: '/customer',
      template: '<customer></customer>',
      authenticate: true
    })
    .state('addcustomer', {
      url: '/addcustomer',
      template: '<addcustomer></addcustomer>',
      authenticate: true
    });
}
