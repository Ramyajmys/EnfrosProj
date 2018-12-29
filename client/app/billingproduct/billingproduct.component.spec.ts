'use strict';

describe('Component: BillingproductComponent', function() {
  // load the controller's module
  beforeEach(module('enfrosProjApp.billingproduct'));

  var BillingproductComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    BillingproductComponent = $componentController('billingproduct', {});
  }));

  it('should ...', function() {
    expect(1).toEqual(1);
  });
});
