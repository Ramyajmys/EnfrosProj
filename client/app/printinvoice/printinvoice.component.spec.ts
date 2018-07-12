'use strict';

describe('Component: PrintinvoiceComponent', function() {
  // load the controller's module
  beforeEach(module('enfrosProjApp.printinvoice'));

  var PrintinvoiceComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    PrintinvoiceComponent = $componentController('printinvoice', {});
  }));

  it('should ...', function() {
    expect(1).toEqual(1);
  });
});
