'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './others.routes';

export class OthersComponent {
  /*@ngInject*/
  constructor() {
  }
}

export default angular.module('enfrosProjApp.others', [uiRouter])
  .config(routes)
  .component('others', {
    template: require('./others.html'),
    controller: OthersComponent,
    controllerAs: 'othersCtrl'
  })
  .name;
