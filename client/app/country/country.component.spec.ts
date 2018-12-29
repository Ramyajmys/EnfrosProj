'use strict';

describe('Component: CountryComponent', function() {
  // load the controller's module
  beforeEach(module('enfrosProjApp.country'));

  var CountryComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    CountryComponent = $componentController('country', {});
  }));

  it('should ...', function() {
    expect(1).toEqual(1);
  });
});
