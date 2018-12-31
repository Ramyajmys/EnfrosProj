'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('billingproduct', {
      url: '/billingproduct',
      template: '<billingproduct></billingproduct>',
      authenticate: 'admin'
    })
    .state('addbillingproduct', {
      url: '/addbillingproduct',
      template: '<addbillingproduct></addbillingproduct>',
      authenticate: 'admin'
    });
}
