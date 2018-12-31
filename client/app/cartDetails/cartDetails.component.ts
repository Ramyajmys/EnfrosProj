'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './cartDetails.routes';
const swal = require('sweetalert');

export class CartDetailsComponent {
  $http;
  $state;
  $mdDialog;
  myService;
  errMsg;
  cInfo;
  custInfo;
  distInfo;
  gstatus;
  finaltotal = 0;
  cart;
  btnClicked: boolean = false;

  reversecharge;
  transportationmode;
  vechiclenumber;
  dateofsupply;
  placeofsupply;
  emailtext = '';

  isLoading: boolean = false;

  /*@ngInject*/
  constructor($http, $state, myService, $mdDialog) {
    this.$http = $http;
    this.$state = $state;
    this.$mdDialog = $mdDialog;
    this.myService = myService;
    // this.cart = this.myService.getCartInfo();
    this.cart = this.myService.getCartInfo2();
    this.custInfo = this.myService.getCustomerInfo();
    this.distInfo = this.myService.getDistributorInfo();
    this.gstatus = this.myService.getGstatus();
    // console.log(this.cart)
  }

  $onInit() {
    if (this.cart.length != 0) {
      this.calculate();
    }
  }

  calculate() {

    // var obj = {}, final = 0;
    // for(let i = 0; i < this.cart.length; i++) {
    //   obj = this.cart[i];
    //   var typ = typeof(obj['product_discount']);
    //   if(typ == 'number') {
    //     final = final + obj['product_total'];
    //     obj['product_discount'] = obj['product_discount'].toFixed(2);
    //     obj['product_total'] = obj['product_total'].toFixed(2);
    //     if(this.gstatus) {
    //       obj['cgst'] = (obj['tax']/2).toFixed(2);
    //       obj['sgst'] = (obj['tax']/2).toFixed(2);
    //       obj['igst'] = 0;
    //     } else {
    //       obj['cgst'] = (obj['tax']/2).toFixed(2);
    //       obj['sgst'] = 0;
    //       obj['igst'] = (obj['tax']/2).toFixed(2);
    //     }
    //   } else {
    //     final = final + parseFloat(obj['product_total']);
    //   }
    // }
    // this.finaltotal = final;
    // this.cInfo = this.cart;



    // var obj = {}, final = 0;
    // for (let i = 0; i < this.cart.length; i++) {
    //   obj = this.cart[i];
    //   var typ = typeof (obj['product_discount']);
    //   if (typ == 'number') {
    //     final = final + obj['product_total'];
    //     obj['product_discount'] = obj['product_discount'].toFixed(2);
    //     obj['product_total'] = obj['product_total'].toFixed(2);
    //     obj['cgst'] = (obj['tax'] / 2).toFixed(2);
    //     obj['sgst'] = (obj['tax'] / 2).toFixed(2);
    //     obj['igst'] = (obj['tax'] / 2).toFixed(2);
    //   } else {
    //     final = final + parseFloat(obj['product_total']);
    //   }
    // }
    // this.finaltotal = final;
    this.cInfo = this.cart;
    this.finaltotal = 0;
    for (let i = 0; i < this.cInfo.length; i++) {
      this.finaltotal = this.finaltotal + this.cInfo[i].product_total;
    }
  }

  // quantityChange(p, q) {
  //   if (q) {

  //     var tax = (parseInt(p.unitprice) * q) * (p.HSN.hsn_percentage / 100);
  //     var discount = (parseInt(p.unitprice) * q) * (p.discount / 100);
  //     var price = (parseInt(p.unitprice) * q) + tax - discount;

  //     var obj = this.cInfo.find(function (obj) {
  //       return obj._id === p._id;
  //     });

  //     if (obj) {
  //       var old_price = obj.product_total;
  //       obj.tax = tax;
  //       obj.product_total = price.toFixed(2);
  //       obj.product_discount = discount.toFixed(2);
  //       obj.product_quantity = q;
  //       this.finaltotal = this.finaltotal - old_price + price;

  //       if (this.gstatus) {
  //         obj['cgst'] = (tax / 2).toFixed(2);
  //         obj['sgst'] = (tax / 2).toFixed(2);
  //         obj['igst'] = 0;
  //       } else {
  //         obj['cgst'] = (tax / 2).toFixed(2);
  //         obj['sgst'] = 0;
  //         obj['igst'] = (tax / 2).toFixed(2);
  //       }

  //       this.myService.saveCartInfo(this.cInfo);
  //     }
  //   }
  // }

  valueChange(product) {
    // console.log(product);
    product.product_total = (product.unitprice + product.cgst + product.sgst + product.igst) * product.product_quantity;
    this.finaltotal = 0;
    for (let i = 0; i < this.cInfo.length; i++) {
      this.finaltotal = this.finaltotal + this.cInfo[i].product_total;
    }
    this.myService.saveCartInfo(this.cInfo);
  }

  confirmDelete(dObj, ev) {
    var confirm = this.$mdDialog.confirm()
      .title('Are you sure?')
      .textContent('You want to delete this item? This action cannot be undone.')
      .targetEvent(ev)
      .ok('Yes')
      .cancel('No');
    var vm = this;
    this.$mdDialog.show(confirm).then(function (success) {
      vm.delete(dObj);
    }, err => {
    });
  }

  delete(p) {
    this.cInfo.splice(this.cInfo.findIndex(item => item._id === p._id), 1);
    this.finaltotal = this.finaltotal - p.product_total;
    if (this.cInfo.length == 0) {
      this.$state.go('productlist');
      this.myService.saveCartInfo(this.cInfo);
    }
  }

  confirmOrder() {
    this.btnClicked = true;
    this.isLoading = true;
    var ex = {
      reversecharge: this.reversecharge,
      transportationmode: this.transportationmode,
      vechiclenumber: this.vechiclenumber,
      dateofsupply: this.dateofsupply,
      placeofsupply: this.placeofsupply,
      emailtext: this.emailtext
    };
    var orderObj = {
      cart: this.cInfo,
      customer: this.custInfo,
      distributor: this.distInfo,
      total: this.finaltotal,
      extra: ex
    };

    this.$http.post('/api/orders/', orderObj).then(response => {
      if (response.status === 200) {
        this.$state.go('admin');
        this.btnClicked = false;
        this.isLoading = false;
        swal({
          title: response.data.msg,
          icon: "success",
        });

        this.myService.saveCartInfo([]);
        this.myService.getCustomerInfo(undefined);
        this.myService.getDistributorInfo(undefined);
        this.myService.getGstatus(undefined);
      }
    }, err => {
      this.isLoading = false;
      if (err.status === 500) {
        this.errMsg = 'Internal Server Error';
        swal({
          title: this.errMsg,
          icon: "error",
        });
      } else if (err.status === 404) {
        this.errMsg = 'Not Found';
        swal({
          title: this.errMsg,
          icon: "error",
        });
      } else {
        this.errMsg = err;
        swal({
          title: this.errMsg,
          icon: "error",
        });
      }
    });
  }

  addProduct() {
    // this.$state.go('productlist');
    this.$state.go('invoice');
  }
}

export default angular.module('enfrosProjApp.cartDetails', [uiRouter])
  .config(routes)
  .component('cartDetails', {
    template: require('./cartDetails.html'),
    controller: CartDetailsComponent,
    controllerAs: 'cartDetailsCtrl'
  })
  .name;
