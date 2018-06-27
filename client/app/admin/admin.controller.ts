'use strict';
const $ = require('jquery'); 

export default class AdminController {
  users: Object[];
  view_tab: any;

  /*@ngInject*/
  constructor(User) {
    // Use the User $resource to fetch all users
    //this.users = User.query();
    this.openCity('b1','Dashboard');
  }

  delete(user) {
    user.$remove();
    this.users.splice(this.users.indexOf(user), 1);
  }

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
}
