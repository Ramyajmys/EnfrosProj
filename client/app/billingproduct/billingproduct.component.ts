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
  def;
  productObj;
  isEdit = false;
  brochure;
  brochurefiles;
  paymentArr = [];
  maxSize = 5;
  bigTotalItems;
  bigCurrentPage = 1;
  offset = 1;
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

    this.paymentArr = [
      { _id: 1, value: 'Paid' },
      { _id: 0, value: 'Unpaid' },
    ];

    this.$element.find('input').on('keydown', function (ev) {
      ev.stopPropagation();
    });

    this.getCategoryList();
    this.getHSN();
    this.getTotalCount();
  }

  $onInit() {
    this.get();
    this.getCustomerList();
    this.getDistributorList();
  }

  New() {
    this.$state.go('addbillingproduct');
  }

  clearSearchTerm() {
    this.searchTerm = '';
  };

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
    // this.selectedProducts = product;
    // console.log(product)
    if(this.rFlag) {
      this.cartArr = this.cartArr.concat(product)
    } else {
      this.cartArr = product;
    }
  }

  cartDetails() {
    // console.log(this.selectedProducts)
    this.myService.saveCartInfo2(this.cartArr);
    this.$state.go('cartDetails');
  }

  getTotalCount() {
    this.$http.post('/api/billingProducts/getAllCount', {}).then(response => {
      if (response.status === 200) {
        // console.log(response.data)
        this.bigTotalItems = response.data;
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

  pagination() {
    this.offset = this.bigCurrentPage;
    this.get();
  }

  get() {
    this.$http.post('/api/billingProducts/getAllBill', { offset: this.offset }).then(response => {
      if (response.status === 200) {
        // console.log(response.data)
        this.productList = response.data;
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

  // edit(prod) {
  //   this.$state.go('editProduct', { product: prod });
  // }

  // picChange(pic) {
  //   if (pic) {
  //     this.def = 'data:' + pic.filetype + ';base64,' + pic.base64;
  //     this.productObj['product_photo'] = pic;
  //   }
  // }

  brochureChange(brochure) {
    this.brochurefiles = brochure;
  }

  save() {
    this.btnClicked = true;
    this.productObj['brochurefiles'] = this.brochurefiles;
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

  // getproductdetails(cid, pid) {
  //   this.$http.post('/api/ProductDetails/getproductdetails', { cid: cid, pid: pid }).then(response => {
  //     if (response.status === 200) {
  //       if (cid == 2) {
  //         this.elist = response.data.elist;
  //         this.mlist = response.data.mlist;
  //         this.flist = response.data.flist;
  //       }
  //       if (cid == 3) {
  //         this.ilist = response.data.ilist;
  //         this.olist = response.data.olist;
  //         this.flist = response.data.flist;
  //       }
  //       if (cid == 4) {
  //         this.klist = response.data.klist;
  //         this.flist = response.data.flist;
  //       }
  //     }
  //   }, err => {
  //     if (err.data.message) {
  //       this.errMsg = err.data.message;
  //     } else if (err.status === 500) {
  //       this.errMsg = 'Internal Server Error';
  //     } else if (err.status === 404) {
  //       this.errMsg = 'Not Found';
  //     } else {
  //       this.errMsg = err;
  //     }
  //   });
  // }

  // delete(dObj) {
  //   this.$http.delete('/api/ProductDetails/' + dObj._id).then(response => {
  //     if (response.status === 204) {
  //       swal({
  //         title: 'Successfully Deleted',
  //         icon: "success",
  //         timer: 1500
  //       });
  //       // this.$mdToast.show(
  //       //   this.$mdToast.simple()
  //       //   .textContent('Successfully Deleted')
  //       //   .position('bottom right')
  //       //   .hideDelay(3000)
  //       // );
  //       this.get();
  //     }
  //   }, err => {
  //     if (err.data.message) {
  //       this.errMsg = err.data.message;
  //     } else if (err.status === 500) {
  //       this.errMsg = 'Internal Server Error';
  //     } else if (err.status === 404) {
  //       this.errMsg = 'Not Found';
  //     } else {
  //       this.errMsg = err;
  //     }
  //   });
  // }

  // confirmDelete(dObj, ev) {
  //   var confirm = this.$mdDialog.confirm()
  //     .title('Are you sure?')
  //     .textContent('You want to delete this item? This action cannot be undone.')
  //     .targetEvent(ev)
  //     .ok('Yes')
  //     .cancel('No');
  //   var vm = this;
  //   this.$mdDialog.show(confirm).then(function (success) {
  //     vm.delete(dObj);
  //   }, err => {
  //     this.closeDialog();
  //   });
  // }

  // closeDialog() {
  //   this.$mdDialog.cancel();
  // };

  // addEdata() {
  //   this.eflag = true;
  //   this.isEdit = false;
  // }

  // saveEdata() {
  //   if (!this.isEdit) {
  //     this.elist.push(this.edata);
  //   }
  // }

  // editEdata(data) {
  //   this.edata = data;
  // }

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
  })
  .component('bill', {
    template: require('./bill.html'),
    controller: BillingproductComponent,
    controllerAs: 'billingproductCtrl'
  })
  .name;
