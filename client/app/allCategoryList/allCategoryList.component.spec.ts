'use strict';

describe('Component: AllCategoryListComponent', function() {
  // load the controller's module
  beforeEach(module('enfrosProjApp.allCategoryList'));

  var AllCategoryListComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    AllCategoryListComponent = $componentController('allCategoryList', {});
  }));

  it('should ...', function() {
    expect(1).toEqual(1);
  });
});
