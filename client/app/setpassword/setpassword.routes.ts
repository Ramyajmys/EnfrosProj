'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('setpassword', {
      url: '/setpassword/:id',
      template: '<setpassword></setpassword>'
    });
}
