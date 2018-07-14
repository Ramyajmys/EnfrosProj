'use strict';

describe('Component: TestRouteComponent', function() {
  // load the controller's module
  beforeEach(module('enfrosProjApp.testRoute'));

  var TestRouteComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    TestRouteComponent = $componentController('testRoute', {});
  }));

  it('should ...', function() {
    expect(1).toEqual(1);
  });
});
