'use strict';

describe('Component: CartDetailsComponent', function() {
  // load the controller's module
  beforeEach(module('enfrosProjApp.cartDetails'));

  var CartDetailsComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    CartDetailsComponent = $componentController('cartDetails', {});
  }));

  it('should ...', function() {
    expect(1).toEqual(1);
  });
});
