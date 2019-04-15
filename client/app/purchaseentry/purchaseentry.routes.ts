'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('purchaseentry', {
      url: '/purchaseentry',
      params: {prod: null},
      template: '<purchaseentry></purchaseentry>'
    });
}
