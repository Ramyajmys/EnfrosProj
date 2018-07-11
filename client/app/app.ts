'use strict';
const angular = require('angular');
// import ngAnimate from 'angular-animate';
const ngCookies = require('angular-cookies');
const ngResource = require('angular-resource');
const ngSanitize = require('angular-sanitize');



const uiRouter = require('angular-ui-router');
const uiBootstrap = require('angular-ui-bootstrap');
import 'angular-validation-match';
import 'angular-animate';
import 'angular-material';


import {routeConfig} from './app.config';

import _Auth from '../components/auth/auth.module';
import account from './account';
import admin from './admin';
import navbar from '../components/navbar/navbar.component';
import footer from '../components/footer/footer.component';
import main from './main/main.component';
import constants from './app.constants';
import util from '../components/util/util.module';
import AddProductCategoryComponent from './addProductCategory/addProductCategory.component';
import AddProductSubCategoryComponent from './addProductSubCategory/addProductSubCategory.component';
import ProductPageComponent from './productPage/productPage.component';
import AllCategoryListComponent from './allCategoryList/allCategoryList.component';
import DistributorComponent from './distributor/distributor.component';
import CustomerComponent from './customer/customer.component';
import SetpasswordComponent from './setpassword/setpassword.component';
import CustomerDashboardComponent from './customerDashboard/customerDashboard.component';
import DistributorDashboardComponent from './distributorDashboard/distributorDashboard.component';
import MyrouteComponent from './myroute/myroute.component';

import 'angular-base64-upload';
import './app.scss';
import myServiceService from './myService/myService.service';

angular.module('testprojApp', [
 'ngAnimate',
 'ngMaterial',
  require('angular-material-data-table'),
  'naif.base64',
  ngCookies,
  ngResource,
  ngSanitize,


  uiRouter,
  uiBootstrap,

  _Auth,
  account,
  admin,
  'validation.match',
    navbar,
  footer,
  main,
  constants,

  util,

  AddProductCategoryComponent,
  AddProductSubCategoryComponent,
  ProductPageComponent,
  AllCategoryListComponent,
  DistributorComponent,
  CustomerComponent,
  SetpasswordComponent,
  CustomerDashboardComponent,
  DistributorDashboardComponent,
  MyrouteComponent,
  myServiceService
])
  .config(routeConfig)
  .run(function($rootScope, $location, Auth) {
    'ngInject';
    // Redirect to login if route requires auth and you're not logged in
    $rootScope.$on('$stateChangeStart', function(event, next) {
      Auth.isLoggedIn(function(loggedIn) {
        if(next.authenticate && !loggedIn) {
          $location.path('/login');
        }
      });
    });
  });

angular
  .element(document)
  .ready(() => {
    angular.bootstrap(document, ['testprojApp'], {
      strictDi: true
    });
  });
