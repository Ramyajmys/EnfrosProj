'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('cartDetails', {
      url: '/cartDetails',
      template: '<cart-details></cart-details>',
      authenticate: true
    });
}
