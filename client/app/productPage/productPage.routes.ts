'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('productPage', {
      url: '/viewproduct',
      template: '<product-page></product-page>',
      params: {product: null}
    });
}
