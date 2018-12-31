'use strict';

describe('Component: InvoiceComponent', function() {
  // load the controller's module
  beforeEach(module('enfrosProjApp.invoice'));

  var InvoiceComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    InvoiceComponent = $componentController('invoice', {});
  }));

  it('should ...', function() {
    expect(1).toEqual(1);
  });
});
