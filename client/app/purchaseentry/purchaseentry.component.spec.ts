'use strict';

describe('Component: PurchaseentryComponent', function() {
  // load the controller's module
  beforeEach(module('enfrosProjApp.purchaseentry'));

  var PurchaseentryComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    PurchaseentryComponent = $componentController('purchaseentry', {});
  }));

  it('should ...', function() {
    expect(1).toEqual(1);
  });
});
