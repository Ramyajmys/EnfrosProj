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
    console.log(this.cObj)
    this.$http.post('/api/quotations/sendContactInfo', this.cObj).then(response => {
      if (response.status === 200) {
        console.log(response)
        swal({
          title: "",
          text: response.data.msg
        });
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

export default angular.module('testprojApp.main', [
  uiRouter])
  .config(routing)
  .component('main', {
    template: require('./main.html'),
    controller: MainController
  })
  .name;
