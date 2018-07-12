'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('printinvoice', {
      url: '/printinvoice',
      params: {cart: null, gStatus: null, finaltotal: null, 
        custInfo: null, distInfo: null, admin: null},
      template: '<printinvoice></printinvoice>'
    });
}
