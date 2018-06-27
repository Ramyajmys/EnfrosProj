'use strict';

describe('Component: CustomerComponent', function() {
  // load the controller's module
  beforeEach(module('enfrosProjApp.customer'));

  var CustomerComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    CustomerComponent = $componentController('customer', {});
  }));

  it('should ...', function() {
    expect(1).toEqual(1);
  });
});
