'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './setpassword.routes';

export class SetpasswordComponent {
  $state;
  $http;
  userid;
  errMsg;
  user: any = {};
  $mdToast;
  emailid;
  sMsg;

  /*@ngInject*/
  constructor($state, $http, $mdToast) {
    this.$state = $state;
    this.$http = $http;
    this.$mdToast = $mdToast;
    this.userid = this.$state.params.id;
  }

  createPassword() {
    this.user['userid'] = this.userid;
    this.$http.post('/api/users/createPassword', this.user).then(response => {
      if(response.status === 200) {
        this.$mdToast.show(
          this.$mdToast.simple()
          .textContent(response.data.message)
          .position('bottom right')
          .hideDelay(3000)
        );
        this.$state.go('login', {msg: response.data.message});
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

export default angular.module('enfrosProjApp.setpassword', [uiRouter])
  .config(routes)
  .component('setpassword', {
    template: require('./setpassword.html'),
    controller: SetpasswordComponent,
    controllerAs: 'setpasswordCtrl'
  })
  .name;
