'use strict';

describe('Component: CityComponent', function() {
  // load the controller's module
  beforeEach(module('enfrosProjApp.city'));

  var CityComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    CityComponent = $componentController('city', {});
  }));

  it('should ...', function() {
    expect(1).toEqual(1);
  });
});
