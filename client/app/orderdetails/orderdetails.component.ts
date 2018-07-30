'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './orderdetails.routes';
const swal = require('sweetalert');

export class OrderdetailsComponent {
  $http;
  $state;
  Auth;
  errMsg;
  getCurrentUser: Function;
  currentUser: any;
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
  orderList;
  orderObj;
  slider = {};
  statusArray = [];
  custInfo;
  distInfo;
  cInfo;
  readonlyslider;

  /*@ngInject*/
  constructor($http, $state, Auth) {
    this.$http = $http;
    this.$state = $state;
    this.Auth = Auth;
  }

  $onInit() {
    if(this.$state.params.order) {
      this.orderObj = this.$state.params.order;
      this.getstatus();
      this.getUsers(this.orderObj.customer._id, this.orderObj.distributor._id);
      this.getOrderDetails(this.orderObj._id);
    }
    var vm = this;
    this.getCurrentUser = this.Auth.getCurrentUser;
    this.getCurrentUser(function(data){
      vm.currentUser = data;
      if(vm.currentUser.role == 'admin' || vm.currentUser.role == 'Distributor') {
        vm.readonlyslider = false;
      } else {
        vm.readonlyslider = true;
      }
      vm.getorders(vm.currentUser.role, vm.currentUser._id);
    });
  }

  getorders(role, id) {
    this.$http.post('/api/orders/getordersbyrole', {role: role, id: id}).then(response => {
      if(response.status === 200) {
        this.orderList = response.data;
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

  getstatus() {
    this.$http.get('/api/Status/').then(response => {
      if(response.status === 200) {
        for(var i=0; i<response.data.length; i++) {
          this.statusArray.push({value: response.data[i]._id, legend: response.data[i].status_name});
        }
        var vm = this;
        this.slider = {
          value: vm.orderObj.status_id,
          options: {
            showSelectionBar: true,
            showTicksValues: true,
            stepsArray: vm.statusArray,
            readOnly: vm.readonlyslider,
            onEnd: function() {
              vm.myChangeListener()
            } 
          }
        };
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

  getUsers(cid, did) {
    this.$http.post('/api/Userprofiles/getusers', {cid: cid, did: did}).then(response => {
      if(response.status === 200) {
        this.custInfo = response.data.customer;
        this.distInfo = response.data.distributor;
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

  view(order) {
    this.orderObj = order;
    this.$state.go('vieworder', {order: order});
  }

  getOrderDetails(oid) {
    this.$http.post('/api/orderDetails/getdetails', {id: oid}).then(response => {
      if(response.status === 200) {
        this.cInfo = response.data;
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

  myChangeListener() {
    this.$http.post('/api/orders/updatestatus', {status: this.slider['value'], id: this.orderObj._id}).then(response => {
      if(response.status === 200) {
        swal({
          title: "Status Successfully Updated",
          icon: "success",
        });
        this.$state.go('orderdetails');
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
 
}

export default angular.module('enfrosProjApp.orderdetails', [uiRouter])
  .config(routes)
  .component('orderdetails', {
    template: require('./orderdetails.html'),
    controller: OrderdetailsComponent,
    controllerAs: 'orderdetailsCtrl'
  })
  .component('vieworder', {
    template: require('./vieworder.html'),
    controller: OrderdetailsComponent,
    controllerAs: 'orderdetailsCtrl'
  })
  .name;
