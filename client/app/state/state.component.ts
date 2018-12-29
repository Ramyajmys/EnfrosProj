'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './state.routes';
const swal = require('sweetalert');

export class StateComponent {
  $mdDialog: any;
  $http;
  $state;
  Auth;
  $mdToast;
  categoryObj
  categoryList;
  errMsg;
  btnClicked: boolean = false;
  flag: boolean = false;
  cObj = {};
  showList: boolean = true;
  maxSize = 5;
  bigTotalItems;
  bigCurrentPage = 1;
  offset = 1;
  list = [];
  cList = [];

  /*@ngInject*/
  constructor($mdDialog, $http, $state, Auth, $mdToast) {
    this.$mdDialog = $mdDialog;
    this.$http = $http;
    this.$state = $state;
    this.Auth = Auth;
    this.$mdToast = $mdToast;
    this.getTotalCount();
    this.getCountryList();
  }

  $onInit() {
    this.get();
  }

  getCountryList() {
    this.$http.get('/api/Countrys').then(response => {
      if(response.status === 200 || response.status === 201) {
       this.cList = response.data;
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

  save() {
    this.btnClicked = true;
    if(!this.flag) {
      this.$http.post('/api/States', this.cObj).then(response => {
        if(response.status === 200 || response.status === 201) {
          swal({
            title: 'Successfully Added',
            icon: "success",
            timer: 1500
          });
          this.btnClicked = false;
          this.showList = true;
          // this.$state.go('allCategoryList');
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
      this.$http.post('/api/States/update', this.categoryObj).then(response => {
        if(response.status === 200 || response.status === 201) {
          swal({
            title: 'Successfully Updated',
            icon: "success",
            timer: 1500
          });
          this.btnClicked = false;
          // this.$state.go('allCategoryList');
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

  pagination() {
    this.offset = this.bigCurrentPage;
    this.get();
  }

  get() {
    this.$http.post('/api/States/getAllState', {offset: this.offset}).then(response => {
      if(response.status === 200) {
        this.list = response.data;
        // console.log(response.data)
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

  getTotalCount() {
    this.$http.post('/api/States/getAllCount', {}).then(response => {
      if(response.status === 200) {
        // console.log(response.data)
        this.bigTotalItems = response.data;
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

export default angular.module('enfrosProjApp.state', [uiRouter])
  .config(routes)
  .component('state', {
    template: require('./state.html'),
    controller: StateComponent,
    controllerAs: 'stateCtrl'
  })
  .name;
