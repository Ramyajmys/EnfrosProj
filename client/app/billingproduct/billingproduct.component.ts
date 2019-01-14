'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './billingproduct.routes';
const swal = require('sweetalert');

export class BillingproductComponent {
  $mdDialog: any;
  $http;
  $state;
  Auth;
  $mdToast;
  myService;
  errMsg;
  getCurrentUser: Function;
  currentUser: any;
  productList;
  btnClicked = false;
  hsnList;
  categoryList;
  subCategoryList;
  productObj;
  isEdit = false;
  brochure;
  brochurefiles;
  paymentArr = [];
  maxSize = 5;
  bigTotalItems;
  bigCurrentPage = 1;
  offset = 1;
  pentryObj = {};
  plist = [];
  noDataFound: boolean = false;

  /*@ngInject*/
  constructor($mdDialog, $http, $state, Auth, $mdToast, myService) {
    this.$mdDialog = $mdDialog;
    this.$http = $http;
    this.$state = $state;
    this.Auth = Auth;
    this.$mdToast = $mdToast;
    this.getCurrentUser = Auth.getCurrentUserSync;
    this.myService = myService;

    this.paymentArr = [
      { _id: 1, value: 'Paid' },
      { _id: 0, value: 'Unpaid' },
    ];

    this.getCategoryList();
    this.getHSN();
    this.getTotalCount();
  }

  $onInit() {
    this.get();
  }

  New() {
    this.$state.go('addbillingproduct');
  }

  getTotalCount() {
    this.$http.post('/api/billingProducts/getAllCount', {}).then(response => {
      if (response.status === 200) {
        // console.log(response.data)
        if(response.data.count != 0) {
          this.noDataFound = false;
          this.bigTotalItems = response.data.count;
        } else {
          this.noDataFound = true;
        }
      }
    }, err => {
      if (err.data.message) {
        this.errMsg = err.data.message;
      } else if (err.status === 500) {
        this.errMsg = 'Internal Server Error';
      } else if (err.status === 404) {
        this.errMsg = 'Not Found';
      } else {
        this.errMsg = err;
      }
    });
  }

  getCategoryList() {
    this.$http.get('/api/ProductCategorys').then(response => {
      this.categoryList = response.data;
    }, err => {
      if (err.status === 500) {
        this.errMsg = 'Internal Server Error';
      } else if (err.status === 404) {
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
      if (err.status === 500) {
        this.errMsg = 'Internal Server Error';
      } else if (err.status === 404) {
        this.errMsg = 'Not Found';
      } else {
        this.errMsg = err;
      }
    });
  }

  onCategoryChange(id) {
    if (id) {
      this.$http.post('/api/ProductSubCategorys/getsubcategory', { id: id }).then(response => {
        this.subCategoryList = response.data;
      }, err => {
        if (err.status === 500) {
          this.errMsg = 'Internal Server Error';
        } else if (err.status === 404) {
          this.errMsg = 'Not Found';
        } else {
          this.errMsg = err;
        }
      });
    }
  }

  pagination() {
    this.offset = this.bigCurrentPage;
    this.get();
  }

  get() {
    this.$http.post('/api/billingProducts/getAllBill', { offset: this.offset }).then(response => {
      if (response.status === 200) {
        // console.log(response.data)
        this.productList = response.data;
      }
    }, err => {
      if (err.data.message) {
        this.errMsg = err.data.message;
      } else if (err.status === 500) {
        this.errMsg = 'Internal Server Error';
      } else if (err.status === 404) {
        this.errMsg = 'Not Found';
      } else {
        this.errMsg = err;
      }
    });
  }

  brochureChange(brochure) {
    this.brochurefiles = brochure;
  }

  addPurchaseEntry() {
    this.pentryObj['attachment'] = 'file';
    this.plist.push(this.pentryObj);
    this.pentryObj = {};
    // console.log(this.plist);
  }

  deletePurchaseEntry(obj) {
    this.plist.splice(this.plist.findIndex(item => item.supplier_name === obj.supplier_name), 1);
  }

  save() {
    this.btnClicked = true;
    this.productObj['plist'] = this.plist;
    // console.log(this.productObj)
    this.$http.post('/api/billingProducts/', this.productObj).then(response => {
      if (response.status === 200) {
        swal({
          title: response.data.message,
          icon: "success",
          timer: 1500
        });
        this.btnClicked = false;
        this.$state.go('billingproduct');
      }
    }, err => {
      this.btnClicked = false;
      if (err.data.message) {
        this.errMsg = err.data.message;
      } else if (err.status === 500) {
        this.errMsg = 'Internal Server Error';
      } else if (err.status === 404) {
        this.errMsg = 'Not Found';
      } else {
        this.errMsg = err;
      }
    });
  }

  viewproduct(billproduct) {
    this.myService.saveBillProduct(billproduct);
    this.$state.go('viewbillingprod');
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

  getFileData(id) {
    this.$http.get('/api/PurchaseEntriess/'+id).then(response => {
      if (response.status === 200) {
        var res = response.data;
        this.downloadFile(res.file, res.filetype, res.filename);
        // console.log(response.data)
      }
    }, err => {
      if (err.data.message) {
        this.errMsg = err.data.message;
      } else if (err.status === 500) {
        this.errMsg = 'Internal Server Error';
      } else if (err.status === 404) {
        this.errMsg = 'Not Found';
      } else {
        this.errMsg = err;
      }
    });
  }

  cancel() {
    this.$state.go('allproducts');
  }

}


export default angular.module('enfrosProjApp.billingproduct', [uiRouter])
  .config(routes)
  .component('addbillingproduct', {
    template: require('./add.html'),
    controller: BillingproductComponent,
    controllerAs: 'billingproductCtrl'
  })
  .component('billingproduct', {
    template: require('./billingproduct.html'),
    controller: BillingproductComponent,
    controllerAs: 'billingproductCtrl'
  }).name;
