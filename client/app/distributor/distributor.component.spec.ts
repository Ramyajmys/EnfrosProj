'use strict';

describe('Component: DistributorComponent', function() {
  // load the controller's module
  beforeEach(module('enfrosProjApp.distributor'));

  var DistributorComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    DistributorComponent = $componentController('distributor', {});
  }));

  it('should ...', function() {
    expect(1).toEqual(1);
  });
});
