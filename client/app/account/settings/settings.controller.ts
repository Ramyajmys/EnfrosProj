'use strict';
// @flow
interface User {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default class SettingsController {
  getCurrentUser: Function;
  currentUser: any;
  user: User = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  };
  errors = {other: undefined};
  message = '';
  submitted = false;
  Auth;
  $mdToast;
  $http;
  country: any;
  states: any;
  cities: any;
  myService;

  /*@ngInject*/
  constructor(Auth, $mdToast, $http, myService) {
    this.Auth = Auth;
    this.$mdToast = $mdToast;
    this.$http = $http;
    this.myService = myService;

    // var vm = this;
    // vm.getCurrentUser = vm.Auth.getCurrentUser;
    // vm.getCurrentUser(function(data){
    //   vm.currentUser = data;
    // });
  }

  changePassword(form) {
    this.submitted = true;

    if(form.$valid) {
      this.Auth.changePassword(this.user.oldPassword, this.user.newPassword)
        .then(() => {
          this.$mdToast.show(
            this.$mdToast.simple()
            .textContent('Password successfully changed.')
            .position('bottom right')
            .hideDelay(3000)
          );
        })
        .catch(() => {
          form.password.$setValidity('mongoose', false);
          this.errors.other = 'Incorrect password';
          this.message = '';
        });
    }
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
}
