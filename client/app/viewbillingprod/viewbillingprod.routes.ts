'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('viewbillingprod', {
      url: '/viewbillingprod',
      params: {product: null},
      template: '<viewbillingprod></viewbillingprod>'
    });
}
