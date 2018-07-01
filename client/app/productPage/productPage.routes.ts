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
    });
}
