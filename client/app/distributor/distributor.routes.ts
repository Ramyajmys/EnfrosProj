'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('distributor', {
      url: '/distributor',
      template: '<distributor></distributor>'
    });
}
