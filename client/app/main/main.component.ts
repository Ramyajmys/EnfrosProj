const angular = require('angular');
const uiRouter = require('angular-ui-router');
import routing from './main.routes';
const swal = require('sweetalert');

export class MainController {
  $http;

  awesomeThings = [];
  newThing = '';
  cObj = {};
  country: any = [];
  errMsg;
  btnClicked: boolean = false;

  /*@ngInject*/
  constructor($http) {
    this.$http = $http;
    this.getCountry();
  }

  $onInit() {
  }

  getCountry() {
    this.$http.get('/api/Countrys').then(response => {
      this.country = response.data;
      // console.log(this.country)
    });
  }

  sendToAdmin() {
    // console.log(this.cObj)
    if (this.cObj['attachment']) {
      this.cObj['basestring'] = this.cObj['attachment'].base64;
    }
    this.btnClicked = true;
    this.$http.post('/api/quotations/sendContactInfo', this.cObj).then(response => {
      if (response.status === 200) {
        // console.log(response)
        swal({
          title: response.data.msg,
          text: ''
        });
        this.btnClicked = false;
        this.cObj = {};
      }
    }, err => {
      this.btnClicked = false;
      this.cObj = {};
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

export default angular.module('testprojApp.main', [
  uiRouter])
  .config(routing)
  .component('main', {
    template: require('./main.html'),
    controller: MainController
  })
  .name;
