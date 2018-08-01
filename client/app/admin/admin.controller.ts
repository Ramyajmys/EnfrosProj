'use strict';
const $ = require('jquery'); 

export default class AdminController {
  users: Object[];
  view_tab: any;
  getCurrentUser: Function;
  currentUser: any;
  Auth;
  myService;
  $http;
  userInfo;
  errMsg;
  $state;

  /*@ngInject*/
  constructor(User, Auth, myService, $http, $state) {
    this.Auth = Auth;
    this.myService = myService;
    this.$http = $http;
    this.$state = $state;
    // Use the User $resource to fetch all users
    //this.users = User.query();
    //this.openCity('b1','Dashboard');

    var vm = this;
    this.getCurrentUser = this.Auth.getCurrentUser;
    this.getCurrentUser(function(data){
      vm.currentUser = data;
    });
  }

  // getUserInfo(id) {
  //   this.$http.post('/api/UserProfiles/getUserInfo', {id: id}).then(response => {
  //     this.userInfo = response.data;
  //     this.myService.saveCurrentUser(this.userInfo);
  //   }, err => {
  //     if(err.status === 500) {
  //       this.errMsg = 'Internal Server Error';
  //     } else if(err.status === 404) {
  //       this.errMsg = 'Not Found';
  //     } else {
  //       this.errMsg = err;
  //     }
  //   });
  // }

  openCity(bid, cityName) {
    var i, tabcontent, tablinks; 
    var j = '#'+cityName;
    tabcontent = document.getElementsByClassName("tabcontent");
    tablinks = document.getElementsByClassName("tablinks");
    
    for (i = 0; i < tabcontent.length; i++) {  
      tablinks[i].className = tablinks[i].className.replace("active", "");
      tabcontent[i].style.display = "none";
    }

    document.getElementById(cityName).style.display = "block";
    $('#'+bid).addClass('active')
  }

  gotoProduct() {
    this.$state.go('productlist')
  }
}
