'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './viewbillingprod.routes';
const swal = require('sweetalert');

export class ViewbillingprodComponent {
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
  categoryList;
  hsnList;
  subCategoryList;
  billproduct;
  productObj;
  purchaseEntries = [];
  paymentArr = [];
  pentryObj = {};
  prod_id;

  /*@ngInject*/
  constructor($mdDialog, $http, $state, Auth, $mdToast, $element, myService) {
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
    this.productObj = this.myService.getBillProduct();
  }

  $onInit() {
    if (this.productObj != null) {
      this.purchaseEntries = this.productObj.PurchaseEntries;
      this.onCategoryChange(this.productObj.category_id);
      this.prod_id = this.productObj['_id'];
      // console.log(this.productObj);
      // console.log(this.purchaseEntries);
    }
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
    this.btnClicked = true;
    this.$http.get('/api/PurchaseEntriess/' + id).then(response => {
      if (response.status === 200) {
        var res = response.data;
        this.downloadFile(res.file, res.filetype, res.filename);
        this.btnClicked = false;
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

  NewEntry() {
    this.btnClicked = false;
    this.$mdDialog.show({
      controller: () => this,
      controllerAs: 'viewbillingprodCtrl',
      template: require('./add.html'),
      clickOutsideToClose: true
    });
  }

  addEntry() {
    if(this.prod_id != undefined || this.prod_id != null) {
      this.pentryObj['prod_id'] = this.prod_id;
      // console.log(this.pentryObj)
      this.btnClicked = true;
      this.$http.post('/api/PurchaseEntriess/', this.pentryObj).then(response => {
        if (response.status === 200) {
          var entry = response.data.entry;
          this.purchaseEntries.push({
            _id: entry._id,
            supplier_name: entry.supplier_name,
            purchase_price: entry.purchase_price,
            quantity: entry.quantity,
            payment_status: entry.payment_status,
            prod_id: entry.prod_id
          });

          this.btnClicked = false;
          this.$mdDialog.cancel();
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
    } else {
      alert("Error")
    }
  }

  save() {
    // console.log(this.productObj)
    this.btnClicked = true;
    this.$http.post('/api/billingProducts/update', this.productObj).then(response => {
      if (response.status === 200) {
        swal({
          title: 'Successfully Updated',
          icon: "success",
          timer: 1500
        });

        this.btnClicked = false;
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
    this.$state.go('billingproduct');
  }
}

export default angular.module('enfrosProjApp.viewbillingprod', [uiRouter])
  .config(routes)
  .component('viewbillingprod', {
    template: require('./viewbillingprod.html'),
    controller: ViewbillingprodComponent,
    controllerAs: 'viewbillingprodCtrl'
  })
  .name;
