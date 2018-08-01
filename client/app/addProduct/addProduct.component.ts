'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './addProduct.routes';

export class AddProductComponent {
  $mdDialog: any;
  $http;
  $state;
  $scope;
  Auth;
  $mdToast;
  getCurrentUser: Function;
  currentUser: any;
  subCategoryObj;
  subCategoryList;
  categoryList;
  hsnList;
  errMsg;
  btnClicked: boolean = false;
  def;
  product_def_pic;
  electrical_data = {};
  mech_data = {};
  elist = [];
  spl_feature = {};
  slist = [];
  productObj = {};
  brochurefiles;

  /*@ngInject*/
  constructor($mdDialog, $http, $state, Auth, $mdToast, $scope) {
    this.$mdDialog = $mdDialog;
    this.$http = $http;
    this.$state = $state;
    this.Auth = Auth;
    this.$mdToast = $mdToast;
    this.$scope = $scope;
    this.getCategoryList();
    this.getHSN();
    this.def = './assets/images/solar.jpg'
  }

  $onInit() {
    var vm = this;
    vm.getCurrentUser = vm.Auth.getCurrentUser;
    vm.getCurrentUser(function(data){
      vm.currentUser = data;
    });
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

  getHSN() {
    this.$http.get('/api/HSNs').then(response => {
      this.hsnList = response.data;
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

  // uploadedFile(element) {
  //   this.brochurefiles = element.files;
  //   this.$scope.$apply();
  // }
  brochureChange(brochure) {
    console.log(brochure)
    this.brochurefiles = brochure;
  }

  addRow() {
    this.elist.push(this.electrical_data);
    this.electrical_data = {};
  }

  addFeature() {
    this.slist.push(this.spl_feature)
    this.spl_feature = {};
  }

  picChange(pic) {
    if(pic) {
      this.def = 'data:'+pic.filetype+';base64,'+pic.base64;
      this.productObj['product_photo'] = this.def;
    }
  }

  save() {
    this.productObj['e_data'] = this.elist;
    this.productObj['m_data'] = this.mech_data;
    this.productObj['features'] = this.slist;
    this.productObj['brochure'] = this.brochurefiles;

    this.$http.post('/api/ProductDetails/', this.productObj).then(response => {
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
    this.productObj = {};
    this.elist = [];
    this.slist = [];
    this.mech_data = {};
    this.electrical_data = {};
    this.spl_feature = {}; 
    this.def = './assets/images/solar.jpg';
    this.product_def_pic = undefined;
  }
}

export default angular.module('enfrosProjApp.addProduct', [uiRouter])
  .config(routes)
  .component('addProduct', {
    template: require('./addProduct.html'),
    controller: AddProductComponent,
    controllerAs: 'addProductCtrl'
  })
  .name;
