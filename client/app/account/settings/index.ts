'use strict';
const angular = require('angular');
import SettingsController from './settings.controller';

export default angular.module('testprojApp.settings', [])
  .controller('SettingsController', SettingsController)
  .name;
