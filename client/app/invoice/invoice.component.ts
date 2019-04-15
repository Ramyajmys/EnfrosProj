'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './invoice.routes';

export class InvoiceComponent {
  $mdDialog: any;
  $http;
  $state;
  Auth;
  $mdToast;
  myService;
  errMsg;
  getCurrentUser: Function;
  currentUser: any;
  productList: any = [];
  isLoading = false;
  customerList;
  distributorList;
  searchTerm;
  selectedProducts;
  $element;
  custInfo;
  distInfo;
  customer;
  distributor;
  rFlag = false;
  cartArr = [];

  /*@ngInject*/
  constructor($mdDialog, $http, $state, Auth, $mdToast, $element, myService) {
    this.$mdDialog = $mdDialog;
    this.$http = $http;
    this.$state = $state;
    this.Auth = Auth;
    this.$mdToast = $mdToast;
    this.getCurrentUser = Auth.getCurrentUserSync;
    this.$element = $element;
    this.myService = myService;

    this.$element.find('input').on('keydown', function (ev) {
      ev.stopPropagation();
    });

    this.get();
  }

  $onInit() {
    this.getCustomerList();
    this.getDistributorList();
  }

  clearSearchTerm() {
    this.searchTerm = '';
  };

  get() {
    this.$http.get('/api/billingProducts/').then(response => {
      if (response.status === 200) {
        // console.log(response.data);
        let pList: any = response.data;
        for(var i=0; i<pList.length; i++) {
          if(pList[i].PurchaseEntries.length > 0) {
            this.productList.push(pList[i])
          }
        }
        // this.productList = response.data;
        this.check();
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

  check() {
    this.cartArr = this.myService.getCartInfo2();
    this.custInfo = this.myService.getCustomerInfo();
    this.distInfo = this.myService.getDistributorInfo();

    if (this.cartArr != undefined) {
      if (this.cartArr.length != 0) {
        this.customer = this.custInfo._id;
        this.distributor = this.distInfo._id;
        this.rFlag = true;

        for(var i=0; i<this.productList.length; i++) {
          for(var j=0; j<this.cartArr.length; j++) {
            if(this.productList[i]._id == this.cartArr[j]._id) {
              this.productList.splice(this.productList.findIndex(item => item._id === this.cartArr[j]._id), 1);
            }
          }
        }
      }

    }
  }

  getCustomerList() {
    this.$http.post('/api/users/get', { role: 'Customer' }).then(response => {
      if (response.status === 200) {
        this.customerList = response.data;
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

  getDistributorList() {
    this.isLoading = true;
    this.$http.post('/api/users/get', { role: 'Distributor' }).then(response => {
      if (response.status === 200) {
        this.isLoading = false;
        this.distributorList = response.data;
      }
    }, err => {
      this.isLoading = false;
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

  onCustomerChange(id) {
    if (this.rFlag) {
      this.$state.reload();
      this.cartArr = [];
      this.rFlag = false;
      this.myService.saveCartInfo2(undefined);
      this.myService.getCustomerInfo(undefined);
      this.myService.getDistributorInfo(undefined);
      this.myService.getGstatus(undefined);
    } else {
      this.$http.post('/api/UserProfiles/getUserInfo', { id: id }).then(response => {
        this.myService.saveCustomerInfo(response.data);
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

  onDistributorChange(id) {
    this.$http.post('/api/UserProfiles/getUserInfo', { id: id }).then(response => {
      this.myService.saveDistributorInfo(response.data);
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

  onProductChange(product) {
    if(product) {
      var vObj;
      for (var i = 0; i < product.length; i++) {
        vObj = product[i];
        product[i]['unitprice'] = 0;
        vObj['product_total'] = 0;
        vObj['product_discount'] = 0;
        vObj['product_quantity'] = 1;
        vObj['qadded'] = true;
        vObj['active'] = true;
        vObj['cgst'] = 0;
        vObj['sgst'] = 0;
        vObj['igst'] = 0;
      }
      // console.log(product)
      if(this.rFlag) {
        this.cartArr = this.cartArr.concat(product)
      } else {
        this.cartArr = product;
      }
    } else {
      this.cartArr = [];
    }
  }

  cartDetails() {
    // console.log(this.selectedProducts)
    this.myService.saveCartInfo2(this.cartArr);
    this.$state.go('cartDetails');
  }
}

export default angular.module('enfrosProjApp.invoice', [uiRouter])
  .config(routes)
  .component('invoice', {
    template: require('./invoice.html'),
    controller: InvoiceComponent,
    controllerAs: 'invoiceCtrl'
  })
  .name;
