'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('addProductSubCategory', {
      url: '/addProductSubCategory',
      template: '<add-product-sub-category></add-product-sub-category>'
    });
}
