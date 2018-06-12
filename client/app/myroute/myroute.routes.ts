'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('myroute', {
      url: '/myroute',
      template: '<myroute></myroute>'
    });
}
