'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('productlist', {
      url: '/productlist',
      template: '<productlist></productlist>'
    });
}
