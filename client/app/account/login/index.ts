'use strict';
const angular = require('angular');
import LoginController from './login.controller';

export default angular.module('testprojApp.login', [])
  .controller('LoginController', LoginController)
  .name;
