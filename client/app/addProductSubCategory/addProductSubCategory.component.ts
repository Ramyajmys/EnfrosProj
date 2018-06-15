'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './addProductSubCategory.routes';

export class AddProductSubCategoryComponent {
  /*@ngInject*/
  constructor() {
  }
}

export default angular.module('enfrosProjApp.addProductSubCategory', [uiRouter])
  .config(routes)
  .component('addProductSubCategory', {
    template: require('./addProductSubCategory.html'),
    controller: AddProductSubCategoryComponent,
    controllerAs: 'addProductSubCategoryCtrl'
  })
  .name;
