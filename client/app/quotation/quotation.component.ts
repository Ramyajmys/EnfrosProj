'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './quotation.routes';
import '../../assets/bower_components/ng-ckeditor/ng-ckeditor';
const swal = require('sweetalert');

export class QuotationComponent {
  $http;
  $state;
  Auth;
  errMsg;
  customerList;
  distributorList;
  template;
  formData = {};
  maxSize = 5;
  bigTotalItems;
  bigCurrentPage = 1;
  offset = 1;
  qList;

  /*@ngInject*/
  constructor($http, $state, Auth) {
    this.$http = $http;
    this.$state = $state;
    this.Auth = Auth;
    this.getCustomerList();
    this.getDistributorList();
    this.getTotalCount();
  }

  $onInit() {
    this.getAllQuoteList();

    this.template = '<h3><strong>KEY COMMERCIAL TERMS &amp; CONDITIONS FOR CAPEX MODEL</strong><h3<br />\
    <p>Under this model, the 50 KW solar power plant will be sold outright to<br />\
    <strong>Dwarka Castings &amp; Engineering Private Limited, Indore.</strong><br />\
    On completion of project, Enfros has no stake in the project other than the gurantees provided.</p>\
    \
<p>&nbsp;</p>\
    \
    <table align="center" border="1" cellpadding="1" cellspacing="1" style="width:auto">\
      <thead>\
        <tr>\
          <th scope="col">Item Description</th>\
          <th scope="col">Unit Price</th>\
        </tr>\
      </thead>\
      <tbody>\
        <tr>\
          <td>Supply, Installation and commissioning of<br />\
          50 KWp Grid Tied PV Solar power plant.</td>\
          <td>21,50,000/-</td>\
        </tr>\
        <tr>\
          <td>a) 5% GST Extra<br />\
          b) Price is for material delivery at your site<br />\
          c) Price includes all the necessary approvals from MPEB<br />\
          <strong><em>d) As per Income Tax Laws, 40% depreciation is available on solar assets, which can<br />\
          be claimed in the first year itself against income from other business.<br />\
          e) 1 Year Operation &amp; Maintenance (included in above price)</em></strong></td>\
          <td>\
          <p>&nbsp;</p>\
    \
          <p>&nbsp;</p>\
          </td>\
        </tr>\
      </tbody>\
    </table>\
    \
    <p>&nbsp;</p>\
    \
    <h4><strong>TERMS &amp; CONDITIONS OF SUPPLY:</strong></h4>\
    \
    <table align="center" border="1" cellpadding="1" cellspacing="1" style="width:auto">\
      <tbody>\
        <tr>\
          <td>Warranty</td>\
          <td>System supplied is warranted against manufacturing defect.<br />\
          Solar Modules: 25 Years,<br />\
          Inverter: 7 Years<br />\
          All other accessories: 25 Years</td>\
        </tr>\
        <tr>\
          <td>Special warranty for<br />\
          Modules</td>\
          <td>Material and workmanship warranty for ten (10) years and a<br />\
          power output warranty of 90% of the nominal output power<br />\
          rating (Pmpp +/- 5%) during the first ten (10) years and 80%<br />\
          during twenty-five (25) years subject to the warranty terms<br />\
          and conditions.</td>\
        </tr>\
        <tr>\
          <td>Payment terms</td>\
          <td>40% advance along with Purchase order (PO),<br />\
          50% against material delivery at site,<br />\
          10% upon installation and commissioning,</td>\
        </tr>\
        <tr>\
          <td>Delivery &amp; Project<br />\
          Installation</td>\
          <td>2 month from the date of advance, handing over of clear<br />\
          site and techno commercially clear order.</td>\
        </tr>\
        <tr>\
          <td>Validity</td>\
          <td>This price is valid till 30th October 2018.</td>\
        </tr>\
      </tbody>\
    </table>\
    \
    <p>&nbsp;</p>\
    ';
  }

  clickNew() {
    this.$state.go('createquotation');
  }

  getCustomerList() {
    this.$http.post('/api/users/get', {role: 'Customer'}).then(response => {
      if(response.status === 200) {
        this.customerList = response.data;
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

  getDistributorList() {
    this.$http.post('/api/users/get', {role: 'Distributor'}).then(response => {
      if(response.status === 200) {
        this.distributorList = response.data;
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

  create() {
    this.formData['template'] = this.template;
    this.formData['date'] = new Date().getTime();
    this.formData['time'] = new Date().getTime();

    this.$http.post('/api/quotations', this.formData).then(response => {
      // console.log(response)
      if(response.status === 200) {
        swal({
          title: response.data.msg,
          icon: "success",
          timer: 1500
        });
        this.$state.go('quotation');
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

  pagination() {
    this.offset = this.bigCurrentPage;
    this.getAllQuoteList();
  }

  getAllQuoteList() {
    this.$http.post('/api/quotations/getAllQuotes', {offset: this.offset}).then(response => {
      if(response.status === 200) {
        this.qList = response.data;
        // console.log(response.data)
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

  getTotalCount() {
    this.$http.post('/api/quotations/getAllQuoteCount', {}).then(response => {
      if(response.status === 200) {
        // console.log(response.data)
        this.bigTotalItems = response.data;
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

export default angular.module('enfrosProjApp.quotation', [uiRouter, 'ngCkeditor'])
  .config(routes)
  .component('quotation', {
    template: require('./quotation.html'),
    controller: QuotationComponent,
    controllerAs: 'quotationCtrl'
  })
  .component('createquotation', {
    template: require('./createquotation.html'),
    controller: QuotationComponent,
    controllerAs: 'quotationCtrl'
  })
  .name;