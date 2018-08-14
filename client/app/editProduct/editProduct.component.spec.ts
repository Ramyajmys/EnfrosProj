'use strict';

describe('Component: EditProductComponent', function() {
  // load the controller's module
  beforeEach(module('enfrosProjApp.editProduct'));

  var EditProductComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    EditProductComponent = $componentController('editProduct', {});
  }));

  it('should ...', function() {
    expect(1).toEqual(1);
  });
});
