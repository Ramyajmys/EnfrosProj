'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('addProductSubCategory', {
      url: '/addProductSubCategory',
      template: '<add-product-sub-category></add-product-sub-category>',
      authenticate: true
    })
    .state('addsub', {
      url: '/subcategory',
      template: '<addsub></addsub>',
      params: {flag: null, data: null},
      authenticate: true
    });
}
