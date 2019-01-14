'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './distributor.routes';
const swal = require('sweetalert');

export class DistributorComponent {
  $mdDialog: any;
  $http;
  $state;
  Auth;
  $mdToast;
  errMsg;
  btnClicked: boolean = false;

  flag: boolean = false; isEdit: boolean = false;
  def: string;
  profilepic: any;
  user = {};
  allRoles: any;
  country: any;
  states: any;
  cities: any;
  distributorList: any;
  myService;

  searchText;

  maxSize = 5;
  bigTotalItems;
  bigCurrentPage = 1;
  offset = 1;
  noDataFound: boolean = false;

  /*@ngInject*/
  constructor($mdDialog, $http, $state, Auth, $mdToast, myService) {
    this.$mdDialog = $mdDialog;
    this.$http = $http;
    this.$state = $state;
    this.Auth = Auth;
    this.$mdToast = $mdToast;
    this.myService = myService;

    this.getRoles();
    this.getCountry();
    this.getTotalCount();
  }

  getTotalCount() {
    this.$http.post('/api/users/getCount', { role: 'Distributor' }).then(response => {
      if (response.status === 200) {
        // console.log(response.data)
        if(response.data.count != 0) {
          this.get();
          this.noDataFound = false;
          this.bigTotalItems = response.data.count;
        } else {
          this.noDataFound = true;
        }
      }
    }, err => {
      this.btnClicked = false;
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

  getRoles() {
    this.$http.get('/api/Roles/').then(response => {
      if (response.status === 200) {
        this.allRoles = response.data;
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

  getCountry() {
    this.$http.get('/api/Countrys').then(response => {
      this.country = response.data;
    });
  }

  getStates(countryid) {
    this.$http.get('/api/States/' + countryid).then(response => {
      this.states = response.data;
    });
  }

  getCities(stateid) {
    this.$http.get('/api/Citys/' + stateid).then(response => {
      this.cities = response.data;
    });
  }

  pagination() {
    this.offset = this.bigCurrentPage;
    this.get();
  }

  get() {
    this.btnClicked = true;
    this.$http.post('/api/users/getalluser', { role: 'Distributor', offset: this.offset }).then(response => {
      if (response.status === 200) {
        // console.log(response.data)
        this.distributorList = response.data;
        this.myService.saveDistributorList(this.distributorList);
        this.btnClicked = false;
      }
    }, err => {
      this.btnClicked = false;
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

  // get() {
  //   this.btnClicked = true;
  //   this.$http.post('/api/users/get', { role: 'Distributor' }).then(response => {
  //     if (response.status === 200) {
  //       this.distributorList = response.data;
  //       this.myService.saveDistributorList(this.distributorList);
  //       this.btnClicked = false;
  //     }
  //   }, err => {
  //     this.btnClicked = false;
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

  clickNew() {
    this.user = {};
    this.flag = true;
    this.def = '/assets/images/def.svg';
    this.user['role'] = 'Distributor';
  }

  picChange(pic) {
    this.def = 'data:' + pic.filetype + ';base64,' + pic.base64;
    if (this.def !== null) {
      this.user['profilepic'] = this.def;
    }
  }

  save() {
    this.btnClicked = true;
    if (!this.isEdit) {
      this.$http.post('/api/users/', this.user).then(response => {
        if (response.status === 200) {
          this.btnClicked = false;
          swal({
            title: response.data.message,
            icon: "success",
            timer: 1500
          });
          this.cancel();
          this.getTotalCount();
        }
      }, err => {
        this.btnClicked = false;
        if (err.data.message) {
          swal({
            title: err.data.message,
            icon: "warning"
          });
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
      this.$http.post('/api/users/updateUser', this.user).then(response => {
        if (response.status === 200) {
          this.btnClicked = false;

          swal({
            title: response.data.message,
            icon: "success",
            timer: 1500
          });
          this.cancel();
          this.getTotalCount();
        }
      }, err => {
        this.btnClicked = false;
        if (err.data.message) {
          swal({
            title: err.data.message,
            icon: "warning"
          });
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

  edit(dObj) {
    this.flag = true;
    this.isEdit = true;

    if (dObj.UserProfile.profilepic != null) {
      this.def = dObj.UserProfile.profilepic;
    } else {
      this.def = '/assets/images/def.svg';
    }
    this.user['_id'] = dObj._id;
    this.user['name'] = dObj.name;
    this.user['email'] = dObj.email;
    this.user['mobilenumber'] = dObj.mobilenumber;
    this.user['address'] = dObj.UserProfile.address;
    this.user['gst_number'] = dObj.UserProfile.gst_number;
    if (dObj.UserProfile.country_id != null) {
      this.user['country_id'] = dObj.UserProfile.country_id;
      this.getStates(dObj.UserProfile.country_id);
    }
    if (dObj.UserProfile.state_id != null) {
      this.user['state_id'] = dObj.UserProfile.state_id;
      this.getCities(dObj.UserProfile.state_id);
    }

    this.user['city_id'] = dObj.UserProfile.city_id;
    this.user['zip'] = dObj.UserProfile.zip;
  }

  delete(dObj) {
    this.$http.delete('/api/users/' + dObj._id).then(response => {
      if (response.status === 204) {
        this.$mdToast.show(
          this.$mdToast.simple()
            .textContent('Successfully Deleted')
            .position('bottom right')
            .hideDelay(3000)
        );
        this.get();
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

  confirmDelete(dObj, ev) {
    var confirm = this.$mdDialog.confirm()
      .title('Are you sure?')
      .textContent('You want to delete this distributor? This action cannot be undone.')
      .targetEvent(ev)
      .ok('Yes')
      .cancel('No');
    var vm = this;
    this.$mdDialog.show(confirm).then(function (success) {
      vm.delete(dObj);
    }, err => {
      this.cancel();
    });
  }

  cancel() {
    this.flag = false;
    this.errMsg = undefined;
    this.profilepic = undefined;
    this.isEdit = false;
    this.user = {};
  }
}

export default angular.module('enfrosProjApp.distributor', [uiRouter])
  .config(routes)
  .component('distributor', {
    template: require('./distributor.html'),
    controller: DistributorComponent,
    controllerAs: 'distributorCtrl'
  })
  .name;
