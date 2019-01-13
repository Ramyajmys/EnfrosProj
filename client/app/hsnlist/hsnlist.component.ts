'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './hsnlist.routes';
const swal = require('sweetalert');

export class HsnlistComponent {
  $mdDialog: any;
  $http;
  $state;
  Auth;
  $mdToast;
  hsnObj
  hsnList;
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
      this.hsnObj = this.$state.params.data;
    }
  }

  New() {
    this.$state.go('addhsn');
  }

  get() {
    this.$http.get('/api/HSNs').then(response => {
      this.hsnList = response.data;
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
      this.$http.post('/api/HSNs', this.hsnObj).then(response => {
        if(response.status === 200 || response.status === 201) {
          swal({
            title: 'Successfully Added',
            icon: "success",
            timer: 1500
          });
          this.btnClicked = false;
          this.$state.go('hsnlist');
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
      this.$http.post('/api/HSNs/update', this.hsnObj).then(response => {
        if(response.status === 200 || response.status === 201) {
          swal({
            title: 'Successfully Updated',
            icon: "success",
            timer: 1500
          });
          this.btnClicked = false;

          this.$state.go('hsnlist');
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
    this.hsnObj = dObj;
    this.$state.go('addhsn', {flag: this.flag, data: dObj});
  }

  delete(dObj) {
    this.$http.delete('/api/HSNs/'+dObj._id).then(response => {
      if(response.status === 204) {
        swal({
          title: 'Successfully Deleted',
          icon: "success",
          timer: 1500
        });
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
    this.$state.go('hsnlist');
  }
}

export default angular.module('enfrosProjApp.hsnlist', [uiRouter])
  .config(routes)
  .component('hsnlist', {
    template: require('./hsnlist.html'),
    controller: HsnlistComponent,
    controllerAs: 'hsnlistCtrl'
  })
  .component('addhsn', {
    template: require('./addhsn.html'),
    controller: HsnlistComponent,
    controllerAs: 'hsnlistCtrl'
  })
  .name;
