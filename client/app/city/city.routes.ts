'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('city', {
      url: '/city',
      template: '<city></city>'
    });
}
