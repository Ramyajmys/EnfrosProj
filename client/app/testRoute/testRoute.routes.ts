'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('testRoute', {
      url: '/testRoute',
      template: '<test-route></test-route>'
    });
}
