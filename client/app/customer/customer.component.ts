'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './customer.routes';

export class CustomerComponent {
  $mdDialog: any;
  $http;
  $state;
  Auth;
  $mdToast;
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
  def: string;
  profilepic: any;
  user = {} ;
  allRoles: any;
  country: any;
  states: any;
  cities: any;
  customerList: any;

  /*@ngInject*/
  constructor($mdDialog, $http, $state, Auth, $mdToast) {
    this.$mdDialog = $mdDialog;
    this.$http = $http;
    this.$state = $state;
    this.Auth = Auth;
    this.$mdToast = $mdToast;
    this.def = '/assets/images/def.svg';
    this.user['role'] = 'Customer';
    this.getRoles();
    this.getCountry();
    this.get();
  }

  getRoles() {
    this.$http.get('/api/Roles/').then(response => {
      if(response.status === 200) {
        this.allRoles = response.data;
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

  getCountry() {
    this.$http.get('/api/Countrys').then(response => {
      this.country = response.data;
    });
  }
  
  getStates(countryid) {
    this.$http.get('/api/States/' + countryid).then(response => {
      this.states = response.data;
    });
  }

  getCities(stateid) {
    this.$http.get('/api/Citys/' + stateid).then(response => {
      this.cities = response.data;
    });
  }

  get() {
    this.$http.post('/api/users/get', {role: 'Customer'}).then(response => {
      if(response.status === 200) {
        this.customerList = response.data;
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

  clickNew() {
    this.flag = true;
  }

  picChange(pic) {
    this.def = 'data:'+pic.filetype+';base64,'+pic.base64;
    if(this.def !== null) {
      this.user['profilepic'] = this.def;
    }
  }

  save() {
    this.$http.post('/api/users/', this.user).then(response => {
      if(response.status === 200) {
        this.$mdToast.show(
          this.$mdToast.simple()
          .textContent(response.data.message)
          .position('bottom right')
          .hideDelay(3000)
        );
        this.cancel();
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
 
  cancel() {
    this.flag = false;
  }
}

export default angular.module('enfrosProjApp.customer', [uiRouter])
  .config(routes)
  .component('customer', {
    template: require('./customer.html'),
    controller: CustomerComponent,
    controllerAs: 'customerCtrl'
  })
  .component('addcustomer', {
    template: require('./add.html'),
    controller: CustomerComponent,
    controllerAs: 'customerCtrl'
  })
  .name;
