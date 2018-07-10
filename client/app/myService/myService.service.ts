'use strict';
const angular = require('angular');

/*@ngInject*/
export function myServiceService() {
	// AngularJS will instantiate a singleton by calling "new" on this function
}

export default angular.module('enfrosProjApp.myService', [])
  .service('myService', myServiceService)
  .name;
