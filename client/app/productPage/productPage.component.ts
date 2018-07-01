'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './productPage.routes';

export class ProductPageComponent {
  $mdDialog: any;
  $http;
  $state;
  Auth;
  $mdToast;
  subCategoryObj;
  subCategoryList;
  categoryList;
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
  solar_default;
  electrical_data = {};
  elist = [];
  spl_feature = {};
  slist = [];
  productObj = {};

  /*@ngInject*/
  constructor($mdDialog, $http, $state, Auth, $mdToast) {
    this.$mdDialog = $mdDialog;
    this.$http = $http;
    this.$state = $state;
    this.Auth = Auth;
    this.$mdToast = $mdToast;
    this.get();
    this.getCategoryList();
    this.solar_default = './assets/images/solar.jpg'
  }

  getCategoryList() {
    this.$http.get('/api/ProductCategorys').then(response => {
      this.categoryList = response.data;
    }, err => {
      if(err.status === 500) {
        this.errMsg = 'Internal Server Error';
      } else if(err.status === 404) {
        this.errMsg = 'Not Found';
      } else {
        this.errMsg = err;
      }
    });
  }

  onCategoryChange(id) {
    if(id) {
      this.$http.post('/api/ProductSubCategorys/getsubcategory', {id: id}).then(response => {
        this.subCategoryList = response.data;
        console.log(this.subCategoryList)
      }, err => {
        if(err.status === 500) {
          this.errMsg = 'Internal Server Error';
        } else if(err.status === 404) {
          this.errMsg = 'Not Found';
        } else {
          this.errMsg = err;
        }
      });
    }
  }

  get() {

  }

  addRow() {
    this.elist.push(this.electrical_data);
    this.electrical_data = {};
  }

  addFeature() {
    this.slist.push(this.spl_feature)
    this.spl_feature = {};
  }
}

export default angular.module('enfrosProjApp.productPage', [uiRouter])
  .config(routes)
  .component('productPage', {
    template: require('./productPage.html'),
    controller: ProductPageComponent,
    controllerAs: 'productPageCtrl'
  })
  .component('addproduct', {
    template: require('./add.html'),
    controller: ProductPageComponent,
    controllerAs: 'productPageCtrl'
  })
  .component('productlist', {
    template: require('./list.html'),
    controller: ProductPageComponent,
    controllerAs: 'productPageCtrl'
  })
  .name;
