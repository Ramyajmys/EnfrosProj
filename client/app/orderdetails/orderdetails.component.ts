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

  emailText;
  smsText;
  statusList;
  statusid;
  rolename;
  userid;

  /*@ngInject*/
  constructor($http, $state, Auth) {
    this.$http = $http;
    this.$state = $state;
    this.Auth = Auth;
    this.getstatusList();
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
      vm.rolename = vm.currentUser.role;
      vm.userid = vm.currentUser._id;
      if(vm.currentUser.role == 'admin' || vm.currentUser.role == 'Distributor') {
        vm.readonlyslider = false;
        vm.getOrdersByStatus(2);
      } else {
        vm.readonlyslider = true;
        vm.getOrdersByStatus(2);
      }
      vm.getorders(vm.rolename, vm.userid, vm.statusid);
    });
  }

  getorders(role, id, sid) {
    this.$http.post('/api/orders/getordersbyrole', {role: role, id: id, sid: sid}).then(response => {
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

  getOrdersByStatus(sid) {
    this.getorders(this.rolename, this.userid, sid);
  }

  getstatusList() {
    this.$http.get('/api/Status/').then(response => {
      if(response.status === 200) {
        this.statusList = response.data;      
        this.statusid = 2;
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
          if(response.data[i]._id == 1) {
            var d = new Date(this.orderObj.order_date);
            var legen;
            if(this.orderObj.order_date != null) {
              legen = response.data[i].status_name + ' ' + d.getDate() + '-' + (d.getMonth() + 1) + '-' + d.getFullYear();
            } else {
              legen = response.data[i].status_name;
            }
            this.statusArray.push({value: response.data[i]._id, legend: legen});
          }
          if(response.data[i]._id == 2) {
            var d = new Date(this.orderObj.order_date);
            var legen;
            if(this.orderObj.order_date != null) {
              legen = response.data[i].status_name + ' ' + d.getDate() + '-' + (d.getMonth() + 1) + '-' + d.getFullYear();
            } else {
              legen = response.data[i].status_name;
            }
            this.statusArray.push({value: response.data[i]._id, legend: legen});
          }
          if(response.data[i]._id == 3) {
            var d = new Date(this.orderObj.ship_date);
            var legen;
            if(this.orderObj.ship_date != null) {
              legen = response.data[i].status_name + ' ' + d.getDate() + '-' + (d.getMonth() + 1) + '-' + d.getFullYear();
            } else {
              legen = response.data[i].status_name;
            }
            this.statusArray.push({value: response.data[i]._id, legend: legen});
          }
          if(response.data[i]._id == 4) {
            var d = new Date(this.orderObj.delivery_date);
            var legen;
            if(this.orderObj.delivery_date != null) {
              legen = response.data[i].status_name + ' ' + d.getDate() + '-' + (d.getMonth() + 1) + '-' + d.getFullYear();
            } else {
              legen = response.data[i].status_name;
            }
            this.statusArray.push({value: response.data[i]._id, legend: legen});
          }
          if(response.data[i]._id == 5) {
            var d = new Date(this.orderObj.delivery_date);
            var legen;
            if(this.orderObj.delivery_date != null) {
              legen = response.data[i].status_name + ' ' + d.getDate() + '-' + (d.getMonth() + 1) + '-' + d.getFullYear();
            } else {
              legen = response.data[i].status_name;
            }
            this.statusArray.push({value: response.data[i]._id, legend: legen});
          }
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

  sendEmail(text, email, name) {
    this.$http.post('/api/orderDetails/sendEmail', {name: name, email: email, text: text}).then(response => {
      if(response.status == 200) {
        swal({
          title: response.data.message,
          icon: "success",
          timer: 1500
        });
        //this.$state.go('orderdetails');
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

  sendSMS(text, mobilenumber, name) {
    this.$http.post('/api/orderDetails/sendSMS', {name: name, mobilenumber: mobilenumber, text: text}).then(response => {
      if(response.status == 200) {
        swal({
          title: response.data.message,
          icon: "success",
          timer: 1500
        });
        //this.$state.go('orderdetails');
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
