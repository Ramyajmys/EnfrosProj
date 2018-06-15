'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('productPage', {
      url: '/productPage',
      template: '<product-page></product-page>'
    });
}
