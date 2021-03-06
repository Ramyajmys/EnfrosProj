'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './productPage.routes';
const swal = require('sweetalert');

export class ProductPageComponent {
  $mdDialog: any;
  $http;
  $state;
  Auth;
  $mdToast;
  errMsg;
  getCurrentUser: Function;
  currentUser: any;
  product;
  myService;
  categoryList;
  elist;
  mlist;
  flist;
  ilist;
  olist;
  klist;
  isLoading: boolean = false;

  /*@ngInject*/
  constructor($mdDialog, $http, $state, Auth, $mdToast, myService) {
    this.$mdDialog = $mdDialog;
    this.$http = $http;
    this.$state = $state;
    this.Auth = Auth;
    this.$mdToast = $mdToast;
    this.myService = myService;

    this.categoryList = this.myService.getCategories();
  }

  $onInit() {
    if(this.$state.params.product) {
      this.product = this.$state.params.product;
      // console.log(this.product)
      this.getproductdetails(this.product.category_id, this.product._id);
    }
  }

  getproductdetails(cid, pid) {
    this.isLoading = true;
    this.$http.post('/api/ProductDetails/getproductdetails', {cid: cid, pid: pid}).then(response => {
      // console.log(response.data)
      if(response.status === 200) {
        this.isLoading = false;
        if(cid == 2) {
          this.product = response.data.product;
          this.elist = response.data.elist;
          this.mlist = response.data.mlist;
          this.flist = response.data.flist;
        }
        if(cid == 3) {
          this.product = response.data.product;
          this.ilist = response.data.ilist;
          this.olist = response.data.olist;
          this.flist = response.data.flist;
        }
        if(cid == 4) {
          this.product = response.data.product;
          this.klist = response.data.klist;
          this.flist = response.data.flist;
        }
        if(cid == 5) {
          this.product = response.data.product;
          this.flist = response.data.flist;
        }
      }
    }, err => {
      this.isLoading = false;
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

  downloadFile(b, type, name) {
    var link = document.createElement('a');
    var data = new Uint8Array(b.data);
    var blob = new Blob([data], { type: type });
    link['href'] = window.URL.createObjectURL(blob);

    var fileName = name;
    link['download'] = fileName;
    document.body.appendChild(link);
    link.click();
  }
}

export default angular.module('enfrosProjApp.productPage', [uiRouter])
  .config(routes)
  .component('productPage', {
    template: require('./productPage.html'),
    controller: ProductPageComponent,
    controllerAs: 'productPageCtrl'
  })
  .name;

