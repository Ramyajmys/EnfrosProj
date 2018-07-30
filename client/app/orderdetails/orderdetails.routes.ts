'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('orderdetails', {
      url: '/orderdetails',
      template: '<orderdetails></orderdetails>'
    })
    .state('vieworder', {
      url: '/vieworder',
      params: {order: null},
      template: '<vieworder></vieworder>'
    });
}
