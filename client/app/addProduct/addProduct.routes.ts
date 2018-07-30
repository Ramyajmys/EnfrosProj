'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('addProduct', {
      url: '/addProduct',
      template: '<add-product></add-product>'
    });
}
