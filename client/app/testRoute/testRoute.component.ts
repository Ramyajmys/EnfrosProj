'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './testRoute.routes';

export class TestRouteComponent {
   message :any;
   /*@ngInject*/
   constructor() {
    this.message = 'Hello';
  }
}

export default angular.module('enfrosProjApp.testRoute', [uiRouter])
  .config(routes)
  .component('testRoute', {
    template: require('./testRoute.html'),
    controller: TestRouteComponent,
    controllerAs: 'testRouteCtrl'
  })
  .name;
