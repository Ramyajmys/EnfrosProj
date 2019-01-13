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
import AddProductSubCategoryComponent from './addProductSubCategory/addProductSubCategory.component';
import ProductPageComponent from './productPage/productPage.component';
import AllCategoryListComponent from './allCategoryList/allCategoryList.component';
import DistributorComponent from './distributor/distributor.component';
import CustomerComponent from './customer/customer.component';
import SetpasswordComponent from './setpassword/setpassword.component';
import CustomerDashboardComponent from './customerDashboard/customerDashboard.component';
import DistributorDashboardComponent from './distributorDashboard/distributorDashboard.component';
import MyrouteComponent from './myroute/myroute.component';
import PrintinvoiceComponent from './printinvoice/printinvoice.component';

import 'angular-base64-upload';
import './app.scss';
import myServiceService from './myService/myService.service';
import OrderdetailsComponent from './orderdetails/orderdetails.component';
import AddProductComponent from './addProduct/addProduct.component';
import CartDetailsComponent from './cartDetails/cartDetails.component';
import ProductlistComponent from './productlist/productlist.component';
import HsnlistComponent from './hsnlist/hsnlist.component';
import EditProductComponent from './editProduct/editProduct.component';
import QuotationComponent from './quotation/quotation.component';
import BillingproductComponent from './billingproduct/billingproduct.component';
import CountryComponent from './country/country.component';
import StateComponent from './state/state.component';
import CityComponent from './city/city.component';
import OthersComponent from './others/others.component';
import InvoiceComponent from './invoice/invoice.component';
import ViewbillingprodComponent from './viewbillingprod/viewbillingprod.component';

import 'angular-print';
import 'angular-material-icons';
import 'angularjs-dropdown-multiselect';
// import * as rzModule from 'angularjs-slider';
const rzModule = require('angularjs-slider');

angular.module('testprojApp', [
 'ngAnimate',
 'ngMaterial',
  require('angular-material-data-table'),
  'naif.base64',
  'AngularPrint',
  'ngMdIcons',
  rzModule,
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

  AddProductSubCategoryComponent,
  ProductPageComponent,
  AllCategoryListComponent,
  DistributorComponent,
  CustomerComponent,
  SetpasswordComponent,
  CustomerDashboardComponent,
  DistributorDashboardComponent,
  MyrouteComponent,
  myServiceService,
  PrintinvoiceComponent,
  OrderdetailsComponent,
  AddProductComponent,
  CartDetailsComponent,
  ProductlistComponent,
  HsnlistComponent,
  EditProductComponent,
  QuotationComponent,
  BillingproductComponent,
  CountryComponent,
  StateComponent,
  CityComponent,
  OthersComponent,
  InvoiceComponent,
  ViewbillingprodComponent
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
