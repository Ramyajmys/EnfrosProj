'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './addProductSubCategory.routes';

export class AddProductSubCategoryComponent {
  $mdDialog: any;
  $http;
  $state;
  Auth;
  $mdToast;
  subCategoryObj;
  subCategoryList;
  categoryList;
  errMsg;
  btnClicked: boolean = false;
  selected = [];
  limitOptions = [5, 10, 15];
  options = {
    rowSelection: true,
    multiSelect: true,
    autoSelect: true,
    decapitate: false,
    largeEditDialog: false,
    boundaryLinks: true,
    limitSelect: true,
    pageSelect: true
  };
  query = {
    order: 'name',
    limit: 5,
    page: 1
  };
  flag: boolean = false;

  /*@ngInject*/
  constructor($mdDialog, $http, $state, Auth, $mdToast) {
    this.$mdDialog = $mdDialog;
    this.$http = $http;
    this.$state = $state;
    this.Auth = Auth;
    this.$mdToast = $mdToast;
    this.get();
    this.getCategoryList();
  }

  New() {
    this.getCategoryList();
    this.flag = false;
    this.subCategoryObj = {};
    var vm = this;
    this.$mdDialog.show({
      controller: () => this,
      controllerAs: 'addProductSubCategoryCtrl',
      template: require('./add.html'),
      clickOutsideToClose: false,
      onRemoving: function(event) {
        vm.get();
      }
    });
  }

  getCategoryList() {
    this.$http.get('/api/ProductCategorys').then(response => {
      this.categoryList = response.data;
     }, err => {
       if(err.status === 500) {
         this.errMsg = 'Internal Server Error';
       } else if(err.status === 404) {
         this.errMsg = 'Not Found';
       } else {
         this.errMsg = err;
       }
     });
  }

  get() {
    this.$http.get('/api/ProductSubCategorys').then(response => {
     this.subCategoryList = response.data;
    }, err => {
      if(err.status === 500) {
        this.errMsg = 'Internal Server Error';
      } else if(err.status === 404) {
        this.errMsg = 'Not Found';
      } else {
        this.errMsg = err;
      }
    });
  }

  save() {
    this.btnClicked = true;
    if(!this.flag) {
      this.$http.post('/api/ProductSubCategorys', this.subCategoryObj).then(response => {
        if(response.status === 200 || response.status === 201) {
          this.$mdToast.show(
            this.$mdToast.simple()
            .textContent('Successfully Added')
            .position('bottom right')
            .hideDelay(3000)
          );
          this.closeDialog();
          this.btnClicked = false;
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
    } else {
      this.$http.post('/api/ProductSubCategorys/update', this.subCategoryObj).then(response => {
        if(response.status === 200 || response.status === 201) {
          this.$mdToast.show(
            this.$mdToast.simple()
            .textContent('Successfully Updated')
            .position('bottom right')
            .hideDelay(3000)
          );
          this.closeDialog();
          this.btnClicked = false;
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
    
  }

  edit(dObj) {
    this.flag = true;
    this.subCategoryObj = dObj;
    var vm = this;
    this.$mdDialog.show({
      template: require('./add.html'),
      controller: () => this,
      controllerAs: 'addProductSubCategoryCtrl',
      clickOutsideToClose: false,
      onRemoving: function(event) {
        vm.get();
      }
    });
  }

  delete(dObj) {
    this.$http.delete('/api/ProductSubCategorys/'+dObj._id).then(response => {
      if(response.status === 204) {
        this.$mdToast.show(
          this.$mdToast.simple()
          .textContent('Successfully Deleted')
          .position('bottom right')
          .hideDelay(3000)
        );
        this.get();
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

  confirmDelete(dObj, ev) {
    var confirm = this.$mdDialog.confirm()
    .title('Are you sure?')
    .textContent('You want to delete this item? This action cannot be undone.')
    .targetEvent(ev)
    .ok('Yes')
    .cancel('No');
    var vm = this;
    this.$mdDialog.show(confirm).then(function(success) {
      vm.delete(dObj);
    }, err => {
      this.closeDialog();
    });
  }
  
  closeDialog() {
    this.$mdDialog.cancel();
  };
}

export default angular.module('enfrosProjApp.addProductSubCategory', [uiRouter])
  .config(routes)
  .component('addProductSubCategory', {
    template: require('./addProductSubCategory.html'),
    controller: AddProductSubCategoryComponent,
    controllerAs: 'addProductSubCategoryCtrl'
  })
  .name;
