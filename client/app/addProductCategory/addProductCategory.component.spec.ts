'use strict';

describe('Component: AddProductCategoryComponent', function() {
  // load the controller's module
  beforeEach(module('enfrosProjApp.addProductCategory'));

  var AddProductCategoryComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    AddProductCategoryComponent = $componentController('addProductCategory', {});
  }));

  it('should ...', function() {
    expect(1).toEqual(1);
  });
});
