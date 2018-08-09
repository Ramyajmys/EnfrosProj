'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './allCategoryList.routes';
const swal = require('sweetalert');

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
  flag: boolean = false;

  /*@ngInject*/
  constructor($mdDialog, $http, $state, Auth, $mdToast) {
    this.$mdDialog = $mdDialog;
    this.$http = $http;
    this.$state = $state;
    this.Auth = Auth;
    this.$mdToast = $mdToast;
    this.get();

    if(this.$state.params.flag != null && this.$state.params.data != null) {
      this.flag = this.$state.params.flag;
      this.categoryObj = this.$state.params.data;
    }
  }

  New() {
    // this.flag = false;
    // this.categoryObj = {};
    this.$state.go('addcat');
    // var vm = this;
    // this.$mdDialog.show({
    //   controller: () => this,
    //   controllerAs: 'cat',
    //   template: require('./addcategory.html'),
    //   clickOutsideToClose: false,
    //   onRemoving: function(event) {
    //     vm.get();
    //   }
    // });
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
    if(!this.flag) {
      this.$http.post('/api/ProductCategorys', this.categoryObj).then(response => {
        if(response.status === 200 || response.status === 201) {
          // this.$mdToast.show(
          //   this.$mdToast.simple()
          //   .textContent('Successfully Added')
          //   .position('bottom right')
          //   .hideDelay(3000)
          // );
          swal({
            title: 'Successfully Added',
            icon: "success",
            timer: 1500
          });
          //this.closeDialog();
          this.btnClicked = false;
          this.$state.go('allCategoryList');
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
      this.$http.post('/api/ProductCategorys/update', this.categoryObj).then(response => {
        if(response.status === 200 || response.status === 201) {
          // this.$mdToast.show(
          //   this.$mdToast.simple()
          //   .textContent('Successfully Updated')
          //   .position('bottom right')
          //   .hideDelay(3000)
          // );
          swal({
            title: 'Successfully Updated',
            icon: "success",
            timer: 1500
          });
          //this.closeDialog();
          this.btnClicked = false;

          this.$state.go('allCategoryList');
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
    this.categoryObj = dObj;

    this.$state.go('addcat', {flag: this.flag, data: dObj});
    // var vm = this;
    // this.$mdDialog.show({
    //   template: require('./addcategory.html'),
    //   controller: () => this,
    //   controllerAs: 'cat',
    //   clickOutsideToClose: false,
    //   onRemoving: function(event) {
    //     vm.get();
    //   }
    // });
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

  cancel() {
    this.$state.reload();
  }
}

export default angular.module('enfrosProjApp.allCategoryList', [uiRouter, require('angular-material-data-table')])
  .config(routes)
  .component('allCategoryList', {
    template: require('./allCategoryList.html'),
    controller: AllCategoryListComponent,
    controllerAs: 'allCategoryListCtrl'
  })
  .component('addcat', {
    template: require('./addcat.html'),
    controller: AllCategoryListComponent,
    controllerAs: 'allCategoryListCtrl'
  })
  .name;
