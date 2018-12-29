'use strict';

describe('Component: StateComponent', function() {
  // load the controller's module
  beforeEach(module('enfrosProjApp.state'));

  var StateComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    StateComponent = $componentController('state', {});
  }));

  it('should ...', function() {
    expect(1).toEqual(1);
  });
});
