'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('quotation', {
      url: '/quotation',
      template: '<quotation></quotation>',
      authenticate: 'admin'
    })
    .state('createquotation', {
      url: '/createquotation',
      template: '<createquotation></createquotation>',
      authenticate: 'admin'
    });
}
