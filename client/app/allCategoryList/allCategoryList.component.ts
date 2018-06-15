'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './allCategoryList.routes';

export class AllCategoryListComponent {
  $mdDialog: any;
  $http;
  $state;
  Auth;
  $mdToast;
  categoryObj
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

  /*@ngInject*/
  constructor($mdDialog, $http, $state, Auth, $mdToast) {
    this.$mdDialog = $mdDialog;
    this.$http = $http;
    this.$state = $state;
    this.Auth = Auth;
    this.$mdToast = $mdToast;
    this.get();
  }

  New() {
    var vm = this;
    this.$mdDialog.show({
      controller: AllCategoryListComponent,
      controllerAs: 'cat',
      template: require('./addcategory.html'),
      clickOutsideToClose: false,
      onRemoving: function(event) {
        vm.get();
      }
    });
  }

  get() {
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

  save() {
    this.btnClicked = true;
    this.$http.post('/api/ProductCategorys', this.categoryObj).then(response => {
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
  }

  edit(dObj) {

  }

  delete(dObj) {
    this.$http.delete('/api/ProductCategorys/'+dObj._id).then(response => {
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

export default angular.module('enfrosProjApp.allCategoryList', [uiRouter, require('angular-material-data-table')])
  .config(routes)
  .component('allCategoryList', {
    template: require('./allCategoryList.html'),
    controller: AllCategoryListComponent,
    controllerAs: 'allCategoryListCtrl'
  })
  .name;
