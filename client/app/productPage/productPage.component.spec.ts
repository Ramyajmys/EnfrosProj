'use strict';

describe('Component: ProductPageComponent', function() {
  // load the controller's module
  beforeEach(module('enfrosProjApp.productPage'));

  var ProductPageComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    ProductPageComponent = $componentController('productPage', {});
  }));

  it('should ...', function() {
    expect(1).toEqual(1);
  });
});
