'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './productlist.routes';
const swal = require('sweetalert');
import * as $ from 'jquery';

export class ProductlistComponent {
  $mdDialog: any;
  $http;
  $state;
  Auth;
  $mdToast;
  errMsg;
  getCurrentUser: Function;
  currentUser: any;

  productList;
  categoryList;
  customerList;
  distributorList;

  showCartBtn: boolean = true;
  cartArr = [];
  cartTotal = 0;

  myService;

  mainGST;
  custGST;
  custInfo;
  distInfo;
  gStatus: boolean;

  searchText;

  selectedIndex = 0;
  catList;
  subList;
  noData: boolean = false;
  customer;
  distributor;

  rFlag = false;

  /*@ngInject*/
  constructor($mdDialog, $http, $state, Auth, $mdToast, myService) {
    this.$mdDialog = $mdDialog;
    this.$http = $http;
    this.$state = $state;
    this.Auth = Auth;
    this.$mdToast = $mdToast;
    this.myService = myService;
    this.getCurrentUser = Auth.getCurrentUserSync;
    this.get();
    this.getCategoryList();
    // this.getCustomerList();
    // this.getDistributorList();
  }

  // check() {
  //   this.cartArr = this.myService.getCartInfo();
  //   this.custInfo = this.myService.getCustomerInfo();
  //   this.distInfo = this.myService.getDistributorInfo();

  //   // if(this.cartArr != undefined) {
  //   if (this.cartArr.length != 0) {
  //     this.customer = this.custInfo._id;
  //     this.distributor = this.distInfo._id;
  //     this.rFlag = true;

  //     var vm = this;
  //     for (var i = 0; i < this.cartArr.length; i++) {
  //       this.productList.find(function (obj) {
  //         if (obj._id == vm.cartArr[i]._id) {
  //           obj['qadded'] = true;
  //         }
  //       })
  //     }
  //     // }
  //   }

  // }

  get() {
    this.$http.get('/api/ProductDetails/').then(response => {
      if (response.status === 200) {
        this.productList = response.data;
        console.log(this.productList)
        if (this.productList.length == 0) {
          this.noData = true;
        } else {
          this.noData = false;
          // this.check();
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
      this.catList = this.categoryList;
      this.catList.unshift({ category_name: 'All', _id: 0 })
      this.myService.saveCategories(this.categoryList);
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
    this.$http.post('/api/users/get', { role: 'Distributor' }).then(response => {
      if (response.status === 200) {
        this.distributorList = response.data;
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

  onCustomerChange(id) {
    if (this.rFlag) {
      this.$state.reload();
      this.cartArr = []
      this.rFlag = false;
      this.myService.saveCartInfo(this.cartArr);
      this.myService.getCustomerInfo(undefined);
      this.myService.getDistributorInfo(undefined);
      this.myService.getGstatus(undefined);
    } else {
      this.$http.post('/api/UserProfiles/getUserInfo', { id: id }).then(response => {
        this.custInfo = response.data;
        this.myService.saveCustomerInfo(this.custInfo);
        this.checkGST(this.custInfo.gst_number);
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

  checkGST(gst) {
    this.$http.post('/api/UserProfiles/checkGst', { gst: gst }).then(response => {
      this.gStatus = response.data.gstatus;
      this.myService.saveGstatus(this.gStatus);
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

  onDistributorChange(id) {
    this.$http.post('/api/UserProfiles/getUserInfo', { id: id }).then(response => {
      this.distInfo = response.data;
      this.myService.saveDistributorInfo(this.distInfo);
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

  addToCart(product) {
    // var tax = parseInt(product.unitprice) * (product.HSN.hsn_percentage / 100);
    // var discount = parseInt(product.unitprice) * (product.discount / 100);
    // var price = parseInt(product.unitprice) + tax - discount;

    // product['tax'] = tax;
    // product['product_total'] = price;
    // product['product_discount'] = discount;
    // product['product_quantity'] = 1;
    // product['qadded'] = true;
    // product['active'] = true;

    // this.showCartBtn = false;
    // if (tax && price || discount) {
    //   this.cartArr.push(product);
    //   this.myService.saveCartInfo(this.cartArr);
    // }
    // this.cartTotal = parseInt(product.unitprice) + this.cartTotal;



    product['tax'] = 0;
    product['unitprice'] = 0;
    product['product_total'] = 0;
    product['product_discount'] = 0;
    product['product_quantity'] = 1;
    product['qadded'] = true;
    product['active'] = true;
    product['cgst'] = 0;
    product['sgst'] = 0;
    product['igst'] = 0;
    this.cartTotal = 0;
    this.showCartBtn = false;
    this.cartArr.push(product);
    swal({
      title: "Successfully Added",
      text: product.product_name + " is added to cart!",
      icon: "success",
    });
  }

  viewcart() {
    this.myService.saveCartInfo(this.cartArr);
    this.$state.go('cartDetails');
  }

  viewproduct(p) {
    this.$state.go('productPage', { product: p });
  }

  getcat(i, cat) {
    this.selectedIndex = i;
    if (cat._id != 0) {
      this.subList = cat.ProductSubCategories;
      this.getproductsBycategory(cat);
    } else {
      this.get();
    }
  }

  getsubcat(i, sub) {
    this.getproductsBysubcategory(sub);
  }

  getproductsBycategory(cat) {
    this.$http.post('/api/ProductDetails/getproductPagecategory', { id: cat._id }).then(response => {
      if (response.status === 200) {
        this.productList = response.data;
        if (this.productList.length == 0) {
          this.noData = true;
        } else {
          this.noData = false;
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

  getproductsBysubcategory(sub) {
    this.$http.post('/api/ProductDetails/getProductsubCategory', { sid: sub._id, cid: sub.category_id }).then(response => {
      if (response.status === 200) {
        this.productList = response.data;
        if (this.productList.length == 0) {
          this.noData = true;
        } else {
          this.noData = false;
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
}

export default angular.module('enfrosProjApp.productlist', [uiRouter])
  .config(routes)
  .component('productlist', {
    template: require('./productlist.html'),
    controller: ProductlistComponent,
    controllerAs: 'productlistCtrl'
  })
  .name;
