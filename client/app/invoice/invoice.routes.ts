'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('invoice', {
      url: '/invoice',
      template: '<invoice></invoice>',
      authenticate: 'admin'
    });
}
