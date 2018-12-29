'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('country', {
      url: '/country',
      template: '<country></country>'
    });
}
