'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('others', {
      url: '/others',
      template: '<others></others>',
      authenticate: 'admin'
    });
}
