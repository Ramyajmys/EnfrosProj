'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('editProduct', {
      url: '/editProduct',
      template: '<edit-product></edit-product>',
      params: {product: null},
      authenticate: true
    })
    .state('allproducts', {
      url: '/allproducts',
      template: '<allproducts></allproducts>',
      authenticate: true
    });
}
