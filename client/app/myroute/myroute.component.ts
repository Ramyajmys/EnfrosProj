'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './myroute.routes';

export class MyrouteComponent {
  /*@ngInject*/
  constructor() {
    this.message = 'Hello';
  }
}

export default angular.module('testprojApp.myroute', [uiRouter])
  .config(routes)
  .component('myroute', {
    template: require('./myroute.html'),
    controller: MyrouteComponent,
    controllerAs: 'myrouteCtrl'
  })
  .name;
