'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('allCategoryList', {
      url: '/allCategoryList',
      template: '<all-category-list></all-category-list>',
      authenticate: true
    })
    .state('addcat', {
      url: '/category',
      template: '<addcat></addcat>',
      params: {flag: null, data: null},
      authenticate: true
    });
}
