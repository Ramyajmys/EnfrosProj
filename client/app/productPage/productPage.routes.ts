'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('productPage', {
      url: '/productPage',
      template: '<product-page></product-page>'
    })
    .state('addproduct', {
      url: '/addproduct',
      template: '<addproduct></addproduct>'
    })
    .state('productlist', {
      url: '/productlist',
      template: '<productlist></productlist>'
    })
    .state('product', {
      url: '/product',
      template: '<product></product>'
    })
    .state('cartdetails', {
      url: '/cartdetails',
      params: {prod: null},
      template: '<cartdetails></cartdetails>'
    });
}
