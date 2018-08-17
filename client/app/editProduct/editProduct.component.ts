'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './editProduct.routes';
const swal = require('sweetalert');

export class EditProductComponent {
  $mdDialog: any;
  $http;
  $state;
  Auth;
  $mdToast;
  errMsg;
  getCurrentUser: Function;
  currentUser: any;
  productList;
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
  btnClicked = false;
  hsnList;
  categoryList;
  subCategoryList;
  def;
  productObj;
  isEdit = false;
  elist; edata = {}; eflag = false;
  mlist;
  flist; fdata = {};
  ilist;
  olist;
  klist;
  brochure;
  brochurefiles;

  /*@ngInject*/
  constructor($mdDialog, $http, $state, Auth, $mdToast) {
    this.$mdDialog = $mdDialog;
    this.$http = $http;
    this.$state = $state;
    this.Auth = Auth;
    this.$mdToast = $mdToast;
    this.getCurrentUser = Auth.getCurrentUserSync;
    this.get();

    if(this.$state.params.product != null) {
      this.productObj = this.$state.params.product;
      this.def = this.productObj['product_photo'];
      this.getproductdetails(this.$state.params.product.category_id, this.$state.params.product._id);
      this.getCategoryList();
      this.getHSN();
      this.onCategoryChange(this.$state.params.product.category_id);
    }
  }

  New() {
    this.$state.go('addProduct');
  }

  get() {
    this.$http.get('/api/ProductDetails/').then(response => {
      if(response.status === 200) {
        this.productList = response.data;
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

  edit(prod) {
    this.$state.go('editProduct', {product: prod});
  }

  picChange(pic) {
    if(pic) {
      this.def = 'data:'+pic.filetype+';base64,'+pic.base64;
      this.productObj['product_photo'] = pic;
    }
  }

  brochureChange(brochure) {
    this.brochurefiles = brochure;
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

  save() {
    this.btnClicked = true;
    this.productObj['brochurefiles'] = this.brochurefiles;
    this.$http.post('/api/ProductDetails/update', this.productObj).then(response => {
      if(response.status === 200) {
        swal({
          title: response.data.message,
          icon: "success",
          timer: 1500
        });
        this.btnClicked = false;
        this.$state.go('allproducts');
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

  getproductdetails(cid, pid) {
    this.$http.post('/api/ProductDetails/getproductdetails', {cid: cid, pid: pid}).then(response => {
      if(response.status === 200) {
        if(cid == 2) {
          this.elist = response.data.elist;
          this.mlist = response.data.mlist;
          this.flist = response.data.flist;
        }
        if(cid == 3) {
          this.ilist = response.data.ilist;
          this.olist = response.data.olist;
          this.flist = response.data.flist;
        }
        if(cid == 4) {
          this.klist = response.data.klist;
          this.flist = response.data.flist;
        }
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

  delete(dObj) {
    this.$http.delete('/api/ProductDetails/'+dObj._id).then(response => {
      if(response.status === 204) {
        swal({
          title: 'Successfully Deleted',
          icon: "success",
          timer: 1500
        });
        // this.$mdToast.show(
        //   this.$mdToast.simple()
        //   .textContent('Successfully Deleted')
        //   .position('bottom right')
        //   .hideDelay(3000)
        // );
        this.get();
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

  confirmDelete(dObj, ev) {
    var confirm = this.$mdDialog.confirm()
    .title('Are you sure?')
    .textContent('You want to delete this item? This action cannot be undone.')
    .targetEvent(ev)
    .ok('Yes')
    .cancel('No');
    var vm = this;
    this.$mdDialog.show(confirm).then(function(success) {
      vm.delete(dObj);
    }, err => {
      this.closeDialog();
    });
  }
  
  closeDialog() {
    this.$mdDialog.cancel();
  };

  addEdata() {
    this.eflag = true;
    this.isEdit = false;
  }

  saveEdata() {
    if(!this.isEdit) {
      this.elist.push(this.edata);
    }
  }

  editEdata(data) {
    this.edata = data;
  }

  cancel() {
    this.$state.go('allproducts');
  }

}

export default angular.module('enfrosProjApp.editProduct', [uiRouter])
  .config(routes)
  .component('editProduct', {
    template: require('./editProduct.html'),
    controller: EditProductComponent,
    controllerAs: 'editProductCtrl'
  })
  .component('allproducts', {
    template: require('./allproducts.html'),
    controller: EditProductComponent,
    controllerAs: 'editProductCtrl'
  })
  .name;
