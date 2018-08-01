'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('allCategoryList', {
      url: '/allCategoryList',
      template: '<all-category-list></all-category-list>',
      authenticate: true
    });
}
