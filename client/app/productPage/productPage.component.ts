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
  def;
  product_def_pic;
  electrical_data = {};
  mech_data = {};
  elist = [];
  spl_feature = {};
  slist = [];
  productObj = {};
  hsnList;
  productList;
  cartList;
  showUpdateBtn: boolean = false;
  quantityNum = 1;
  hsnInfo;
  getCurrentUser: Function;
  currentUser: any;
  mainGST; custGST; distGST; custInfo; distInfo;
  total; cgst; sgst; igst; finaltotal; hsn_div; cgst_per; sgst_per; igst_per;
  isUser = false;
  cartArr = [];
  cartTotal = 0;
  cInfo;
  gStatus: boolean;
  myService;
  customerList; distributorList; 
  showInvoice: boolean = false;

  /*@ngInject*/
  constructor($mdDialog, $http, $state, Auth, $mdToast, myService) {
    this.$mdDialog = $mdDialog;
    this.$http = $http;
    this.$state = $state;
    this.Auth = Auth;
    this.$mdToast = $mdToast;
    this.get();
    this.getCategoryList();
    this.getHSN();
    this.def = './assets/images/solar.jpg'
    this.myService = myService;
    this.cInfo =  this.myService.getCartInfo();

    this.getCurrentUser = Auth.getCurrentUserSync;
  }

  $onInit() {

    this.customerList = this.myService.getCustomerList();
    this.distributorList = this.myService.getDistributorList();
    this.currentUser = this.myService.getCurrentUser();

    if(this.cInfo) {
      this.calculate();
    }
    
  }

  onCustomerChange(id) {
    this.$http.post('/api/UserProfiles/getUserInfo', {id: id}).then(response => {
      this.custInfo = response.data;
      this.custGST = response.data.gst_number.substring(0, 2);
      this.mainGST = this.currentUser.gst_number.substring(0, 2);
      if(this.custGST && this.mainGST) {
        if(this.custGST == this.mainGST) {
          this.gStatus = true;
        } else {
          this.gStatus = false;
        }
      }
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

  onDistributorChange(id) {
    this.$http.post('/api/UserProfiles/getUserInfo', {id: id}).then(response => {
      this.distInfo = response.data;
      this.distGST = response.data.gst_number.substring(0, 2);
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

  cal() {
    if(this.isUser) {
      if(this.custGST == this.mainGST) {
        this.total = this.cartList['unitprice'];
        this.hsn_div = this.hsnInfo.hsn_percentage / 2;
        this.cgst = this.total * (this.hsn_div/100);
        this.sgst = this.total * (this.hsn_div/100);
        this.igst = 0;
        this.cgst_per = this.hsn_div;
        this.sgst_per = this.hsn_div;
        this.igst_per = 0;
        this.finaltotal = parseInt(this.total)  + this.cgst + this.sgst + this.igst;
      } else {
        this.total = this.cartList['unitprice'];
        this.hsn_div = this.hsnInfo.hsn_percentage / 2;
        this.cgst = this.total * (this.hsn_div/100);
        this.sgst = 0;
        this.igst = this.total * (this.hsn_div/100);
        this.cgst_per = this.hsn_div;
        this.sgst_per = 0;
        this.igst_per = this.hsn_div;
        this.finaltotal = parseInt(this.total)  + this.cgst + this.sgst + this.igst;
      }
    } else {
      this.total = this.cartList['unitprice'];
      this.hsn_div = this.hsnInfo.hsn_percentage / 2;
      this.cgst = this.total * (this.hsn_div/100);
      this.sgst = this.total * (this.hsn_div/100);
      this.igst = 0;
      this.cgst_per = this.hsn_div;
      this.sgst_per = this.hsn_div;
      this.igst_per = 0;
      this.finaltotal = parseInt(this.total)  + this.cgst + this.sgst + this.igst;
    }
    
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

  getHsnById(id) {
    this.$http.get('/api/HSNs/'+id).then(response => {
      this.hsnInfo = response.data;
      this.cal();
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

  get() {
    this.$http.get('/api/ProductDetails/').then(response => {
      if(response.status === 200) {
        this.productList = response.data;
        //console.log(this.productList);
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

  addToCart(product) {
    swal({
      title: "Added",
      text: product.product_name + " is added to quote!",
      icon: "success",
    });
    var tax =  parseInt(product.unitprice)  * (product.HSN.hsn_percentage/100);
    var discount = parseInt(product.unitprice) * (product.discount /100);
    var price = parseInt(product.unitprice) + tax - discount;
    
    product['tax'] = tax;
    product['totalprice'] = price;
    product['discountprice'] = discount;

    if(tax && price && discount) {
      this.cartArr.push(product);
    }
  
    this.cartTotal = parseInt(product.unitprice)  + this.cartTotal;
  }

  viewcart() {
    this.myService.saveCartInfo(this.cartArr);
    this.$state.go('cartdetails');
  }

  quantityChange(q) {
    this.showUpdateBtn = true;
  }

  calculate() {
    var obj = {}, final = 0;
    for(let i = 0; i < this.cInfo.length; i++) {
      obj = this.cInfo[i];
      final = final + obj['totalprice'];
    }
    this.finaltotal = final;
  }

  showCal() {
    this.showInvoice = true;
  }

  confirmOrder() {
    this.$state.go('printinvoice', {
      cart: this.cInfo, gStatus: this.gStatus, finaltotal: this.finaltotal, 
      custInfo: this.custInfo, distInfo: this.distInfo, admin: this.currentUser
    });
  }

  cancel() {
    this.productObj = {};
    this.elist = [];
    this.slist = [];
    this.mech_data = {};
    this.electrical_data = {};
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
  .component('product', {
    template: require('./product.html'),
    controller: ProductPageComponent,
    controllerAs: 'productPageCtrl'
  })
  .component('cartdetails', {
    template: require('./cartdetails.html'),
    controller: ProductPageComponent,
    controllerAs: 'productPageCtrl'
  })
  .name;

