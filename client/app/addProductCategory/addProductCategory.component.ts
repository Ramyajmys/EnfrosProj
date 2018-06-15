'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './addProductCategory.routes';

export class AddProductCategoryComponent {
  $mdDialog: any;
  $http;
  $state;
  Auth;
  $mdToast;
  categoryObj;
  errMsg;

  /*@ngInject*/
  constructor($mdDialog, $http, $state, Auth, $mdToast) {
    this.$mdDialog = $mdDialog;
    this.$http = $http;
    this.$state = $state;
    this.Auth = Auth;
    this.$mdToast = $mdToast;
  }

  saveCategory() {
    this.$http.post('/api/ProductCategorys', this.categoryObj).then(response => {
      if(response.status === 200 || response.status === 201) {
        this.$mdToast.show(
          this.$mdToast.simple()
          .textContent('Successfully Added')
          .position('bottom right')
          .hideDelay(3000)
        );    
        this.closeDialog();
      }
    }, err => {
      if(err.data.message) {
        this.errMsg = err.data.message;
      } else if(err.status === 500) {
        this.errMsg = 'Internal Server Error';
      } else if(err.status === 404) {
        this.errMsg = 'Not Found';
      } else {
        this.errMsg = err;
      }
    });
  }
  
  closeDialog() {
    this.$mdDialog.cancel();
  };
}

export default angular.module('enfrosProjApp.addProductCategory', [uiRouter])
  .config(routes)
  .component('addProductCategory', {
    template: require('./addProductCategory.html'),
    controller: AddProductCategoryComponent,
    controllerAs: 'addProductCategoryCtrl'
  })
  .name;
