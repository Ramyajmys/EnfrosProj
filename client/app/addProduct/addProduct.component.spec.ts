'use strict';

describe('Component: AddProductComponent', function() {
  // load the controller's module
  beforeEach(module('enfrosProjApp.addProduct'));

  var AddProductComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    AddProductComponent = $componentController('addProduct', {});
  }));

  it('should ...', function() {
    expect(1).toEqual(1);
  });
});
