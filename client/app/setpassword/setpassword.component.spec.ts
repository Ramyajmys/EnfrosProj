'use strict';

describe('Component: SetpasswordComponent', function() {
  // load the controller's module
  beforeEach(module('enfrosProjApp.setpassword'));

  var SetpasswordComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    SetpasswordComponent = $componentController('setpassword', {});
  }));

  it('should ...', function() {
    expect(1).toEqual(1);
  });
});
