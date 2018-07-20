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
  showCartBtn: boolean = true;
  quantityNum = 1;
  hsnInfo;
  getCurrentUser: Function;
  currentUser: any;
  mainGST; custGST; distGST; custInfo; distInfo;
  total; cgst; sgst; igst; finaltotal; hsn_div; cgst_per; sgst_per; igst_per;
  isUser = false;
  cartArr = [];
  cartTotal = 0;
  cInfo = [];
  gStatus: boolean;
  myService;
  customerList; distributorList; 
  showInvoice: boolean = false;
  len;

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

    
  }

  $onInit() {
  

    this.customerList = this.myService.getCustomerList();
    this.distributorList = this.myService.getDistributorList();
    //this.currentUser = this.myService.getCurrentUser();

    this.cInfo =  this.myService.getCartInfo();
    this.custInfo = this.myService.getCustomerInfo();
    this.distInfo = this.myService.getDistributorInfo();

    // console.log(this.custInfo);
    // console.log(this.distInfo);
    // console.log(this.cInfo);

    if(this.cInfo.length != 0) {
      this.calculate();
    }
    this.len = this.cartArr.length;

    // var vm = this;
    // vm.getCurrentUser = vm.Auth.getCurrentUser;
    // vm.getCurrentUser(function(data){
    //   vm.currentUser = data;
    // });
  }

  onCustomerChange(id) {
    this.$http.post('/api/UserProfiles/getUserInfo', {id: id}).then(response => {
      this.custInfo = response.data;
      this.custGST = response.data.gst_number.substring(0, 2);
      this.mainGST = this.currentUser.gst_number.substring(0, 2);
      this.myService.saveCustomerInfo(this.custInfo);
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
      this.myService.saveDistributorInfo(this.distInfo);
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
      title: "Successfully Added",
      text: product.product_name + " is added to quote!",
      icon: "success",
    });
    var tax =  parseInt(product.unitprice)  * (product.HSN.hsn_percentage/100);
    var discount = parseInt(product.unitprice) * (product.discount /100);
    var price = parseInt(product.unitprice) + tax - discount;
    
    product['tax'] = tax;
    product['product_total'] = price;
    product['product_discount'] = discount;
    product['quantity'] = 1;
    product['active'] = true;

    this.showCartBtn = false;

    if(tax && price && discount) {
      this.cartArr.push(product);
    }
  
    this.cartTotal = parseInt(product.unitprice)  + this.cartTotal;
  }

  viewcart() { 
    this.myService.saveCartInfo(this.cartArr);
    this.$state.go('cartdetails');
    // if(this.cInfo.length == 0) {
    //   this.myService.saveCartInfo(this.cartArr);
    //   this.$state.go('cartdetails');
    // } else {
    //   var vm = this;
    //   this.cartArr.forEach(function(element) {
    //     vm.cInfo.push(element);
    //     vm.myService.saveCartInfo(vm.cInfo);
    //     vm.$state.go('cartdetails');
    //   });
    // }
  }

  quantityChange(p, q) {
    if(q) {

      var tax =  (parseInt(p.unitprice) * q)  * (p.HSN.hsn_percentage/100);
      var discount = (parseInt(p.unitprice) * q) * (p.discount /100);
      var price = (parseInt(p.unitprice) * q) + tax - discount;
  
      var obj = this.cInfo.find(function (obj) { 
        return obj._id === p._id; 
      });

      if(obj) {
        var old_price = obj.product_total;
        obj.tax = tax;
        obj.product_total = price;
        obj.product_discount = discount;
        obj.quantity = q;
        this.finaltotal = this.finaltotal - old_price + price;

        this.myService.saveCartInfo(this.cInfo);
      }
    }
  }

  removeProduct(p) {
    // var len = this.cInfo.length;
    // swal({
    //   title: "Are you sure?",
    //   text: "Once deleted, you will not be able to recover this product!",
    //   icon: "warning",
    //   buttons: true,
    //   dangerMode: true,
    //   closeOnClickOutside: false,
    // })
    // .then((willDelete) => {
    //   if (willDelete) {
    //     this.cInfo.splice(this.cInfo.findIndex(item => item._id === p._id), 1);
    //     this.finaltotal = this.finaltotal - p.product_total;

    //     if(len != this.cInfo.length) {
    //       swal({
    //         icon: "success",
    //         title: "Deleted!",
    //         text: "Your product has been deleted!",
    //         type: "success",
    //         timer: 1000
    //       });
    //     }
    //   } else {
    //     swal("Your product file is safe!");
    //   }
    // });

    this.cInfo.splice(this.cInfo.findIndex(item => item._id === p._id), 1);
    this.finaltotal = this.finaltotal - p.product_total;
    if(this.cInfo.length == 0) {
      this.$state.go('admin');
    }
  }

  calculate() {
    var obj = {}, final = 0;
    for(let i = 0; i < this.cInfo.length; i++) {
      obj = this.cInfo[i];
      final = final + obj['product_total'];
    }
    this.finaltotal = final;
  }

  showCal() {
    // this.showInvoice = true;
    this.$state.go('cartdetails');
  }

  confirmOrder() {
    this.btnClicked = true;
    var orderObj = {
      cart: this.cInfo,
      customer: this.custInfo,
      distributor: this.distInfo,
      total: this.finaltotal,
      admin: this.currentUser,
      gStatus: this.gStatus
    };
    // console.log(this.cInfo);
    // console.log(this.custInfo);
    // console.log(this.distInfo);

    this.$http.post('/api/orders/',orderObj).then(response => {
      // console.log(response)
      if(response.status === 200) {
        this.$state.go('admin');
        this.btnClicked = false;
        swal({
          title: "Order sucessfully placed",
          icon: "success",
        });
        // console.log(response)
        // this.$state.go('printinvoice', {
        //   cart: this.cInfo, gStatus: this.gStatus, finaltotal: this.finaltotal, 
        //   custInfo: this.custInfo, distInfo: this.distInfo, admin: this.currentUser
        // });
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


    // this.$state.go('printinvoice', {
    //   cart: this.cInfo, gStatus: this.gStatus, finaltotal: this.finaltotal, 
    //   custInfo: this.custInfo, distInfo: this.distInfo, admin: this.currentUser
    // });
  }

  cancel() {
    this.productObj = {};
    this.elist = [];
    this.slist = [];
    this.mech_data = {};
    this.electrical_data = {};
    this.spl_feature = {}; 
    this.product_def_pic = './assets/images/solar.jpg'
  }

  savefile() {

    this.$http.post('/api/UserProfiles/savefile', {}).then(response => {
      console.log("jdhjdf")
    }, err => {
      console.log(err)
    });
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

