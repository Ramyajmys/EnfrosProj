'use strict';
// @flow
interface User {
  name: string;
  email: string;
  password: string;
}

export default class LoginController {
  user: User = {
    name: '',
    email: '',
    password: ''
  };
  errors = {login: undefined};
  submitted = false;
  Auth;
  $state;
  getCurrentUser: Function;
  currentUser: any;
  role: any;

  /*@ngInject*/
  constructor(Auth, $state) {
    this.Auth = Auth;
    this.$state = $state;
  }

  login(form) {
    this.submitted = true;

    if (form.$valid) {
      this.Auth.login({
        email: this.user.email,
        password: this.user.password
      })
      .then(() => {
        // Logged in, redirect to home
        // this.$state.go('main');
        this.currentUserInfo();
      })
      .catch(err => {
        this.errors.login = err.message;
      });
    }
  }

  currentUserInfo() {
    var vm = this;
    this.getCurrentUser = this.Auth.getCurrentUser;
    this.getCurrentUser(function(data){
      vm.currentUser = data;
      vm.role = vm.currentUser['role'];
      if(vm.role === 'admin') {
        vm.$state.go('admin');
      } else if(vm.role === 'Distributor') {
        vm.$state.go('main');
        // vm.$state.go('distributorDashboard');
      } else if(vm.role === 'Customer') {
        vm.$state.go('main');
        // vm.$state.go('customerDashboard');
      } else {
        vm.$state.go('main');
      }
    });
  }
}
