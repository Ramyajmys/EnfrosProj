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
  errMsg;
  message = '';
  submitted = false;
  Auth;
  $mdToast;
  $http;
  country: any;
  states: any;
  cities: any;
  myService;
  $state;
  userinfo;

  /*@ngInject*/
  constructor(Auth, $mdToast, $http, myService, $state) {
    this.Auth = Auth;
    this.$mdToast = $mdToast;
    this.$http = $http;
    this.myService = myService;
    this.$state = $state;

    var vm = this;
    vm.getCurrentUser = vm.Auth.getCurrentUser;
    vm.getCurrentUser(function(data){
      vm.currentUser = data;
      vm.userinfo = data;
      vm.getCountry();
      if(vm.userinfo.UserProfile.country_id != null) {
        vm.getStates(vm.userinfo.UserProfile.country_id)
      }
      if(vm.userinfo.UserProfile.state_id != null) {
        vm.getCities(vm.userinfo.UserProfile.state_id)
      }
    });
  }

  changePassword(form) {
    this.submitted = true;
    form.password.$setValidity('mongoose', true);
    if(form.$valid) {
      this.Auth.changePassword(this.user.oldPassword, this.user.newPassword)
        .then(() => {
          this.$mdToast.show(
            this.$mdToast.simple()
            .textContent('Password successfully changed.')
            .position('bottom right')
            .hideDelay(3000)
          );
          this.$state.go('settings');
        })
        .catch(() => {
          form.password.$setValidity('mongoose', false);
          this.errors.other = 'Incorrect password';
          this.message = '';
          this.$mdToast.show(
            this.$mdToast.simple()
            .textContent('Incorrect password')
            .position('bottom right')
            .hideDelay(3000)
          );
          this.$state.reload('settings');
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

  editPic(pic) {
    this.userinfo.UserProfile['profilepic'] = 'data:'+pic.filetype+';base64,'+pic.base64;
  }

  userInfoUpdate() {
    this.$http.post('/api/users/updateUser', this.userinfo).then(response => {
      if(response.status === 200) {
        this.$mdToast.show(
          this.$mdToast.simple()
          .textContent(response.data.message)
          .position('bottom right')
          .hideDelay(3000)
        );
        this.cancel();
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
    this.$state.reload();
  }
}
