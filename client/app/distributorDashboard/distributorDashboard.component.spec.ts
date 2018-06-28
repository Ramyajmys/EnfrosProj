'use strict';

describe('Component: DistributorDashboardComponent', function() {
  // load the controller's module
  beforeEach(module('enfrosProjApp.distributorDashboard'));

  var DistributorDashboardComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    DistributorDashboardComponent = $componentController('distributorDashboard', {});
  }));

  it('should ...', function() {
    expect(1).toEqual(1);
  });
});
