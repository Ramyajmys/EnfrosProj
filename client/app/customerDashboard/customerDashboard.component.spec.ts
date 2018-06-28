'use strict';

describe('Component: CustomerDashboardComponent', function() {
  // load the controller's module
  beforeEach(module('enfrosProjApp.customerDashboard'));

  var CustomerDashboardComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    CustomerDashboardComponent = $componentController('customerDashboard', {});
  }));

  it('should ...', function() {
    expect(1).toEqual(1);
  });
});
