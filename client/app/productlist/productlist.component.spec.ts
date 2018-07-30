'use strict';

describe('Component: ProductlistComponent', function() {
  // load the controller's module
  beforeEach(module('enfrosProjApp.productlist'));

  var ProductlistComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    ProductlistComponent = $componentController('productlist', {});
  }));

  it('should ...', function() {
    expect(1).toEqual(1);
  });
});
