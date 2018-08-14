'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('hsnlist', {
      url: '/hsnlist',
      template: '<hsnlist></hsnlist>',
      authenticate: true
    })
    .state('addhsn', {
      url: '/hsn',
      template: '<addhsn></addhsn>',
      params: {flag: null, data: null},
      authenticate: true
    });
}
