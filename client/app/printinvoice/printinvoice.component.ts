'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './printinvoice.routes';
// let  pdfMake = require('pdfmake/build/pdfmake.js'); 
// let pdfFonts = require('pdfmake/build/vfs_fonts.js');
// import pdfMake from "pdfmake/build/pdfmake";
// import pdfFonts from "pdfmake/build/vfs_fonts";
var pdfMake = require('pdfmake/build/pdfmake.js');
var pdfFonts = require('pdfmake/build/vfs_fonts.js');
pdfMake.vfs = pdfFonts.pdfMake.vfs;

export class PrintinvoiceComponent {
  $http;
  $state;
  cInfo;
  gStatus;
  finaltotal;
  custInfo;
  distInfo;
  admin;
  quantityNum = 1;

  /*@ngInject*/
  constructor($http, $state) {
    this.$http = $http;
    this.$state = $state;

    this.cInfo = this.$state.params.cart;
    this.gStatus = this.$state.params.gStatus;
    this.finaltotal = this.$state.params.finaltotal;
    this.custInfo = this.$state.params.custInfo;
    this.distInfo = this.$state.params.distInfo;
    this.admin = this.$state.params.admin;

    console.log(this.admin);
    console.log(this.custInfo);

    
  }

  save() {


    // let docDefinition: any = { content: 'This is an sample PDF printed with pdfMake' };
    let docDefinition: any = {
      content: [
        'This paragraph fills full width, as there are no columns. Next paragraph however consists of three columns',
        {
          columns: [
            {
              // auto-sized columns have their widths based on their content
              width: 'auto',
              text: 'First column'
            },
            {
              // star-sized columns fill the remaining space
              // if there's more than one star-column, available width is divided equally
              width: '*',
              text: 'Second column'
            },
            {
              // fixed width
              width: 100,
              text: 'Third column'
            },
            {
              // % width
              width: '20%',
              text: 'Fourth column'
            }
          ],
          // optional space between columns
          columnGap: 10
        },
        'This paragraph goes below all columns and has full width'
      ]
    };

    const pdfDocGenerator = pdfMake.createPdf(docDefinition);
    pdfDocGenerator.getBase64((data) => {
    
      alert(data)
      if(data) {
        this.$http.post('/api/UserProfiles/savefile', {buffer: data}).then(response => {
          console.log("jdhjdf")
        }, err => {
          console.log(err)
        });
      }
    });
    //pdfMake.createPdf(docDefinition).download();
    // this.$http.post('/api/UserProfiles/savefile', {}).then(response => {
    //   console.log("jdhjdf")
    // }, err => {
    //   console.log(err)
    // });
  }
}

export default angular.module('enfrosProjApp.printinvoice', [uiRouter])
  .config(routes)
  .component('printinvoice', {
    template: require('./printinvoice.html'),
    controller: PrintinvoiceComponent,
    controllerAs: 'printinvoiceCtrl'
  })
  .name;
