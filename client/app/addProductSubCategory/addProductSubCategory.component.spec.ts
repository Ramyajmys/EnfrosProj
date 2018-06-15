'use strict';

describe('Component: AddProductSubCategoryComponent', function() {
  // load the controller's module
  beforeEach(module('enfrosProjApp.addProductSubCategory'));

  var AddProductSubCategoryComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    AddProductSubCategoryComponent = $componentController('addProductSubCategory', {});
  }));

  it('should ...', function() {
    expect(1).toEqual(1);
  });
});
