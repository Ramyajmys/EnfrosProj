'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('state', {
      url: '/state',
      template: '<state></state>',
      authenticate: 'admin'
    });
}
