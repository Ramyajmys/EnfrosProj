'use strict';
/* eslint no-sync: 0 */
const jQuery = require('jquery'); 
const angular = require('angular');
import 'angular-scroll';

export class NavbarComponent {
  menu = [{
    'title': 'Home',
    'state': 'main'
  }];
  isLoggedIn: Function;
  isAdmin: Function;
  isCustomer: Function;
  isDistributor: Function;
  getCurrentUser: Function;
  isCollapsed = true;

  constructor(Auth) {
    'ngInject';
    this.isLoggedIn = Auth.isLoggedInSync;
    this.isAdmin = Auth.isAdminSync;
    this.isCustomer = Auth.isCustomerSync;
    this.isDistributor = Auth.isDistributorSync;
    this.getCurrentUser = Auth.getCurrentUserSync;

    jQuery(window).on('scroll', function() {
      var y = jQuery(window).scrollTop();
        if(y > 300) {
          jQuery("#go-top").css('display', 'block').fadeIn(400);
        } else {
          jQuery("#go-top").fadeOut(400);
        }
    });

      /*---------------------------Toggle menu--------------------------- */  
  var toggleButton = jQuery('.menu-toggle'), nav = jQuery('.main-navigation');

  toggleButton.on('click', function(event) {
    event.preventDefault();

    toggleButton.toggleClass('is-clicked');
      nav.slideToggle();
    });

    if(toggleButton.is(':visible')) {
      nav.addClass('mobile');
    }

    jQuery(window).resize(function() {
      if(toggleButton.is(':visible')) {
        nav.addClass('mobile');
      } else {
        nav.removeClass('mobile');
      } 
    });

    jQuery('#main-nav-wrap li a').on("click", function() {
      if (nav.hasClass('mobile')) {
        toggleButton.toggleClass('is-clicked'); 
        nav.fadeOut();   		
      } 
    });
  
  }

  backtoTop() {
    jQuery("html, body").animate({ scrollTop: "0px" }, 1000);
  }

}

export default angular.module('directives.navbar', ['duScroll'])
  .component('navbar', {
    template: require('./navbar.html'),
    controller: NavbarComponent
  })
  .name;
