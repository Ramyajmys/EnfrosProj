'use strict';
const angular = require('angular');
import SettingsController from './settings.controller';

export default angular.module('testprojApp.settings', [])
  // .controller('SettingsController', SettingsController)
  .component('settings', {
    template: require('./settings.html'),
    controller: SettingsController,
    controllerAs: 'vm'
  })
  .component('editprofile', {
    template: require('./editprofile.html'),
    controller: SettingsController,
    controllerAs: 'vm'
  })
  .name;
