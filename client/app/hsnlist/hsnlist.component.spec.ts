'use strict';

describe('Component: HsnlistComponent', function() {
  // load the controller's module
  beforeEach(module('enfrosProjApp.hsnlist'));

  var HsnlistComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    HsnlistComponent = $componentController('hsnlist', {});
  }));

  it('should ...', function() {
    expect(1).toEqual(1);
  });
});
