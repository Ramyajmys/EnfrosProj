'use strict';

describe('Component: ViewbillingprodComponent', function() {
  // load the controller's module
  beforeEach(module('enfrosProjApp.viewbillingprod'));

  var ViewbillingprodComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    ViewbillingprodComponent = $componentController('viewbillingprod', {});
  }));

  it('should ...', function() {
    expect(1).toEqual(1);
  });
});
