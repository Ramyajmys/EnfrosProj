'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('addProductCategory', {
      url: '/addProductCategory',
      template: '<add-product-category></add-product-category>'
    });
}
