'use strict';

describe('Component: OthersComponent', function() {
  // load the controller's module
  beforeEach(module('enfrosProjApp.others'));

  var OthersComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    OthersComponent = $componentController('others', {});
  }));

  it('should ...', function() {
    expect(1).toEqual(1);
  });
});
